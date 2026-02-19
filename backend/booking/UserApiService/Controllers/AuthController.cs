using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Xml.Linq;
using UserApiService.Models;
using UserApiService.Services;
using UserApiService.Services.Interfaces;
using UserApiService.View;

namespace UserApiService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController :  ControllerBase
    {

        private readonly IAuthService _authService;
        private readonly ITokenService _tokenService;
        private User _user;
        private static string _token = "";

        private static string _name = "";
        private static string _email = "";

        private static string _host = "";

        public AuthController(IAuthService authService, ITokenService tokenService)
        {
            _authService = authService;
            _tokenService = tokenService;
        }






        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var referer = Request.Headers["Referer"].ToString();


            _host = string.IsNullOrEmpty(referer) ? Request.Host.ToString() : new Uri(referer).Authority;



            var redirectUrl = Url.Action("GoogleResponse", "Auth", null, Request.Scheme);
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };


            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("signin-google")]
        public async Task<IActionResult> GoogleResponse()
        {

            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            var claims = result?.Principal?.Identities.FirstOrDefault()?.Claims;

            if (claims != null)
            {
                _email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                _name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

                if (_user.Username == _name && _user.Email == _email)
                {
                    _token = _tokenService.GenerateJwtToken(_user);
                    SaveAdmin();

                    var redirectUrl = $"http://{_host}/admin-dashboard";
                    return Redirect(redirectUrl);
                }

            }


            return Unauthorized();

        }









        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("register/client")]
        public async Task<IActionResult> RegisterClient([FromBody] RegisterRequest request)
        {
            try
            {
                if (request.BirthDate == null)
                    return BadRequest("Дата рождения обязательна");

                var today = DateTime.UtcNow.Date;
                var age = today.Year - request.BirthDate.Value.Year;

                if (request.BirthDate.Value.Date > today.AddYears(-age))
                    age--;

                if (age < 18)
                    return BadRequest("Регистрация доступна только для пользователей старше 18 лет");

                request.RoleName = "Client";
                request.Discount = 0;

                var response = await _authService.RegisterAsync(request);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("register/owner")]
        public async Task<IActionResult> RegisterOwner([FromBody] RegisterRequest request)
        {
            try
            {
                if (request.BirthDate == null)
                    return BadRequest("Дата рождения обязательна");

                var today = DateTime.UtcNow.Date;
                var age = today.Year - request.BirthDate.Value.Year;

                if (request.BirthDate.Value.Date > today.AddYears(-age))
                    age--;

                if (age < 18)
                    return BadRequest("Регистрация доступна только для пользователей старше 18 лет");

                request.RoleName = "Owner";
                request.Discount = 0;

                var response = await _authService.RegisterAsync(request);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _authService.DeleteUserAsync(id);
            if (!success)
                return NotFound(new { message = "Пользователь не найден" });

            return Ok(new { message = "Пользователь успешно удалён" });
        }
    }
}
