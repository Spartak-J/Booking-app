#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${BASE_URL:-http://localhost:5000}"
EXTENDED=0
LOGIN_EMAIL="${LOGIN_EMAIL:-user@oselya.app}"
LOGIN_PASSWORD="${LOGIN_PASSWORD:-UserPass123!}"
FALLBACK_LOGIN_EMAIL="${FALLBACK_LOGIN_EMAIL:-owner@oselya.app}"
FALLBACK_LOGIN_PASSWORD="${FALLBACK_LOGIN_PASSWORD:-OwnerPass123!}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILURES=0
WARNINGS=0

ok() { printf "${GREEN}[OK]${NC} %s\n" "$1"; }
warn() { WARNINGS=$((WARNINGS + 1)); printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
fail() { FAILURES=$((FAILURES + 1)); printf "${RED}[FAIL]${NC} %s\n" "$1"; }
step() { printf "\n== %s ==\n" "$1"; }

usage() {
  cat <<EOF
Usage: $(basename "$0") [--extended] [--base-url URL]

Options:
  --extended       Run extra payment smoke checks (LiqPay/PayPal health visibility)
  --base-url URL   Override base URL (default: $BASE_URL)
  -h, --help       Show this help

Env overrides:
  LOGIN_EMAIL, LOGIN_PASSWORD
  FALLBACK_LOGIN_EMAIL, FALLBACK_LOGIN_PASSWORD
EOF
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "Command not found: $1"
    exit 1
  fi
}

http_call() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  local auth_header="${4:-}"
  local tmp_body
  tmp_body="$(mktemp)"
  local code
  if [[ -n "$data" ]]; then
    if [[ -n "$auth_header" ]]; then
      code="$(curl -sS -m 20 -o "$tmp_body" -w "%{http_code}" -X "$method" "$url" \
      -H "Authorization: Bearer $auth_header" \
      -H 'Content-Type: application/json' -d "$data" || true)"
    else
      code="$(curl -sS -m 20 -o "$tmp_body" -w "%{http_code}" -X "$method" "$url" \
      -H 'Content-Type: application/json' -d "$data" || true)"
    fi
  else
    if [[ -n "$auth_header" ]]; then
      code="$(curl -sS -m 20 -o "$tmp_body" -w "%{http_code}" -X "$method" "$url" \
      -H "Authorization: Bearer $auth_header" || true)"
    else
      code="$(curl -sS -m 20 -o "$tmp_body" -w "%{http_code}" -X "$method" "$url" || true)"
    fi
  fi
  printf "%s|%s\n" "$code" "$tmp_body"
}

check_contains() {
  local body_file="$1"
  local needle="$2"
  grep -q "$needle" "$body_file"
}

extract_json_field() {
  local body_file="$1"
  local field="$2"
  sed -n "s/.*\"${field}\":[[:space:]]*\"\([^\"]*\)\".*/\1/p" "$body_file" | head -n1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --extended)
      EXTENDED=1
      shift
      ;;
    --base-url)
      BASE_URL="${2:-}"
      if [[ -z "$BASE_URL" ]]; then
        fail "--base-url requires a value"
        exit 1
      fi
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

require_cmd docker
require_cmd docker-compose
require_cmd curl

step "Docker services"
if docker-compose -f "$ROOT_DIR/docker-compose.yml" ps >/dev/null 2>&1; then
  ok "docker-compose is reachable"
  compose_ps="$(docker-compose -f "$ROOT_DIR/docker-compose.yml" ps || true)"
  printf "%s\n" "$compose_ps"
  if echo "$compose_ps" | grep -qi "unhealthy"; then
    warn "Some containers are unhealthy (see output above)"
  else
    ok "No unhealthy containers in compose ps"
  fi
else
  fail "docker-compose is not reachable"
fi

step "Gateway availability"
IFS='|' read -r code body_file < <(http_call GET "$BASE_URL/Bff/admin/health")
if [[ "$code" == "200" ]] && check_contains "$body_file" "\"services\""; then
  ok "Admin health endpoint responds"
  if check_contains "$body_file" "\"id\":\"paypal\""; then
    paypal_status="$(sed -n 's/.*"id":"paypal","name":"PayPal","category":"payments","status":"\([^"]*\)".*/\1/p' "$body_file" | head -n1)"
    [[ -n "$paypal_status" ]] && printf "PayPal status: %s\n" "$paypal_status"
  fi
  if check_contains "$body_file" "\"id\":\"liqpay\""; then
    liqpay_status="$(sed -n 's/.*"id":"liqpay","name":"LiqPay","category":"payments","status":"\([^"]*\)".*/\1/p' "$body_file" | head -n1)"
    [[ -n "$liqpay_status" ]] && printf "LiqPay status: %s\n" "$liqpay_status"
  fi
else
  fail "Admin health endpoint failed (HTTP $code)"
  [[ -f "$body_file" ]] && cat "$body_file" || true
fi
[[ -n "${body_file:-}" ]] && rm -f "$body_file"

step "Currency rates"
IFS='|' read -r code body_file < <(http_call GET "$BASE_URL/Bff/currency/rates")
if [[ "$code" == "200" ]] && check_contains "$body_file" "\"rates\""; then
  ok "Currency rates endpoint responds with rates"
else
  fail "Currency rates endpoint failed (HTTP $code)"
  [[ -f "$body_file" ]] && cat "$body_file" || true
fi
[[ -n "${body_file:-}" ]] && rm -f "$body_file"

step "Email login (seed account)"
primary_payload="{\"login\":\"$LOGIN_EMAIL\",\"password\":\"$LOGIN_PASSWORD\"}"
IFS='|' read -r code body_file < <(http_call POST "$BASE_URL/User/login" "$primary_payload")
if [[ "$code" == "200" ]] && check_contains "$body_file" "\"token\""; then
  ok "Email login works for $LOGIN_EMAIL"
else
  warn "Primary login failed for $LOGIN_EMAIL (HTTP $code), trying fallback account"
  [[ -n "${body_file:-}" ]] && rm -f "$body_file"

  fallback_payload="{\"login\":\"$FALLBACK_LOGIN_EMAIL\",\"password\":\"$FALLBACK_LOGIN_PASSWORD\"}"
  IFS='|' read -r code body_file < <(http_call POST "$BASE_URL/User/login" "$fallback_payload")
  if [[ "$code" == "200" ]] && check_contains "$body_file" "\"token\""; then
    ok "Email login works via fallback account $FALLBACK_LOGIN_EMAIL"
  else
    fail "Email login failed for both primary and fallback accounts (last HTTP $code)"
    [[ -f "$body_file" ]] && cat "$body_file" || true
  fi
fi
[[ -n "${body_file:-}" ]] && rm -f "$body_file"

step "Email-only login contract"
IFS='|' read -r code body_file < <(http_call POST "$BASE_URL/User/login" '{"login":"admin","password":"AdminPass123!"}')
if [[ "$code" == "401" ]]; then
  ok "Username login is rejected (email-only mode active)"
else
  warn "Username login returned HTTP $code (expected 401 for email-only)"
  [[ -f "$body_file" ]] && cat "$body_file" || true
fi
[[ -n "${body_file:-}" ]] && rm -f "$body_file"

step "Google login endpoint wiring"
IFS='|' read -r code body_file < <(http_call POST "$BASE_URL/User/google" '{"idToken":"fake-token-for-smoke"}')
if [[ "$code" == "400" || "$code" == "401" || "$code" == "500" ]]; then
  ok "Google auth endpoint is reachable (HTTP $code)"
else
  warn "Unexpected Google auth HTTP code: $code"
fi
[[ -n "${body_file:-}" ]] && rm -f "$body_file"

step "Mobile typecheck"
if npm -C "$ROOT_DIR/mobile-app" run -s typecheck >/dev/null 2>&1; then
  ok "mobile-app typecheck passed"
else
  fail "mobile-app typecheck failed"
fi

if [[ "$EXTENDED" -eq 1 ]]; then
  step "Extended: LiqPay create payment"
  payment_payload='{"bookingId":"predefense-smoke","amount":10.00,"currency":"UAH","method":"pay","clientType":"mobile"}'
  IFS='|' read -r code body_file < <(http_call POST "$BASE_URL/Bff/payments/create" "$payment_payload")
  if [[ "$code" == "200" ]] && check_contains "$body_file" "\"paymentId\"" && check_contains "$body_file" "liqpay"; then
    ok "Create payment works and returns LiqPay redirect"
    payment_id="$(extract_json_field "$body_file" "paymentId")"
    redirect_url="$(extract_json_field "$body_file" "redirectUrl")"
    [[ -n "$payment_id" ]] && printf "paymentId: %s\n" "$payment_id"
    [[ -n "$redirect_url" ]] && printf "checkout: %s\n" "$redirect_url"
  else
    fail "Create payment failed (HTTP $code)"
    [[ -f "$body_file" ]] && cat "$body_file" || true
  fi
  [[ -n "${body_file:-}" ]] && rm -f "$body_file"

  if [[ -n "${payment_id:-}" ]]; then
    step "Extended: LiqPay payment status"
    IFS='|' read -r code body_file < <(http_call GET "$BASE_URL/Bff/payments/status/$payment_id")
    if [[ "$code" == "200" ]] && check_contains "$body_file" "\"status\""; then
      ok "Payment status endpoint responds"
    else
      fail "Payment status failed (HTTP $code)"
      [[ -f "$body_file" ]] && cat "$body_file" || true
    fi
    [[ -n "${body_file:-}" ]] && rm -f "$body_file"
  fi

  step "Extended: LiqPay tokenization start"
  tokenize_payload='{"userId":"predefense-user","holderName":"Predefense User","clientType":"mobile"}'
  IFS='|' read -r code body_file < <(http_call POST "$BASE_URL/Bff/payments/tokenize/start" "$tokenize_payload")
  if [[ "$code" == "200" ]] && check_contains "$body_file" "\"paymentId\"" && check_contains "$body_file" "liqpay"; then
    ok "Tokenize start works and returns LiqPay redirect"
    tok_payment_id="$(extract_json_field "$body_file" "paymentId")"
    tok_redirect_url="$(extract_json_field "$body_file" "redirectUrl")"
    [[ -n "$tok_payment_id" ]] && printf "tokenizePaymentId: %s\n" "$tok_payment_id"
    [[ -n "$tok_redirect_url" ]] && printf "tokenizeCheckout: %s\n" "$tok_redirect_url"
  else
    fail "Tokenize start failed (HTTP $code)"
    [[ -f "$body_file" ]] && cat "$body_file" || true
  fi
  [[ -n "${body_file:-}" ]] && rm -f "$body_file"

  if [[ -n "${tok_payment_id:-}" ]]; then
    step "Extended: LiqPay tokenization status"
    IFS='|' read -r code body_file < <(http_call GET "$BASE_URL/Bff/payments/tokenize/status/$tok_payment_id")
    if [[ "$code" == "200" ]] && check_contains "$body_file" "\"status\""; then
      ok "Tokenization status endpoint responds"
    else
      fail "Tokenization status failed (HTTP $code)"
      [[ -f "$body_file" ]] && cat "$body_file" || true
    fi
    [[ -n "${body_file:-}" ]] && rm -f "$body_file"
  fi

  step "Extended: PayPal create payment"
  paypal_payload='{"bookingId":"predefense-smoke-paypal","amount":10.00,"currency":"USD","method":"pay","clientType":"web","provider":"paypal"}'
  IFS='|' read -r code body_file < <(http_call POST "$BASE_URL/Bff/payments/create" "$paypal_payload")
  if [[ "$code" == "200" ]] && check_contains "$body_file" "\"paymentId\"" && check_contains "$body_file" "paypal"; then
    ok "Create PayPal payment works and returns approval URL"
    pp_payment_id="$(extract_json_field "$body_file" "paymentId")"
    pp_redirect_url="$(extract_json_field "$body_file" "redirectUrl")"
    [[ -n "$pp_payment_id" ]] && printf "paypalPaymentId: %s\n" "$pp_payment_id"
    [[ -n "$pp_redirect_url" ]] && printf "paypalCheckout: %s\n" "$pp_redirect_url"
  else
    fail "Create PayPal payment failed (HTTP $code)"
    [[ -f "$body_file" ]] && cat "$body_file" || true
  fi
  [[ -n "${body_file:-}" ]] && rm -f "$body_file"

  if [[ -n "${pp_payment_id:-}" ]]; then
    step "Extended: PayPal payment status"
    IFS='|' read -r code body_file < <(http_call GET "$BASE_URL/Bff/payments/status/$pp_payment_id")
    if [[ "$code" == "200" ]] && check_contains "$body_file" "\"status\""; then
      ok "PayPal payment status endpoint responds"
    else
      fail "PayPal payment status failed (HTTP $code)"
      [[ -f "$body_file" ]] && cat "$body_file" || true
    fi
    [[ -n "${body_file:-}" ]] && rm -f "$body_file"
  fi
fi

step "Summary"
printf "Failures: %s\n" "$FAILURES"
printf "Warnings: %s\n" "$WARNINGS"

if [[ "$FAILURES" -gt 0 ]]; then
  exit 1
fi

exit 0
