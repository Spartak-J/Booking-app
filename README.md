# Mobile App (React Native)

This project implements the OSELYA mobile client (Expo/React Native). It now includes the owner-facing booking view, add-home flow, reviews list, and refreshed navigation for the owner role.

## Owner mode updates
- Bookings tab for role `owner` now opens **OwnerBookingsScreen** with collapsible cards per reservation (mock data).
- Owner listings remain in **OwnerObjectForm** (Add/Edit) reachable from the bookings screen CTA.
- Profile screen renames “Мої подорожі” to “Моє житло” and uses a home icon when role is owner.
- New **OwnerAddHomeScreen** to add a property: photos upload placeholders, amenity checklist from mocks, guest/room/bed counters, price input.
- New **OwnerReviewsScreen** shows reviews for the owner’s homes (mocked).

## Running
```bash
cd mobile-app
npm install
npm run start
```

## Quality checks
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`

## Mocks
- Bookings for owners come from `bookingService.getOwnerBookings` (mock data from `data/bookings` + `mockOffers`).
- Amenities and homes use `paramService.getAmenities` + `mockOffers`.
- Reviews for owners are pulled from `mockReviews` filtered by owner offers.
- Hotels metadata comes from `HotelsRepository` mocks.
- Landmarks search results are sourced from `data/landmarks/landmarks.mock.ts`, filtered by the selected city mock.

## Navigation
- Bottom tab “Bookings” routes to owner bookings when role is `owner`; otherwise to renter bookings.
- Owner can add/edit listings via the “Створити об’єкт” button inside the owner bookings screen.
