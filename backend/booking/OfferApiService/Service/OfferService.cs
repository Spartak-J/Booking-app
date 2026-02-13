using Globals.Sevices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using OfferApiService.Models;
using OfferApiService.Models.RentObjModel;
using OfferApiService.Models.View;
using OfferApiService.Service;
using OfferApiService.Service.Interface;
using OfferApiService.View;
using System.Net.Http.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace OfferApiService.Services
{
    public class OfferService : TableServiceBase<Offer, OfferContext>, IOfferService
    {

        public  async Task<Offer> GetOnlyOfferAsync(int id, params string[] includeProperties)
        {
            using var db = new OfferContext();

            var offers = await GetEntitiesAsync();
            return offers.FirstOrDefault(o => o.id == id);
        }
        public override async Task<Offer> GetEntityAsync(int id, params string[] includeProperties)
        {
            using var db = new OfferContext();

            return await db.Offers
                //.Include(o => o.OfferOrderLinks)
                //.Include(o => o.BookedDates)
                .Include(o => o.RentObj)
                    .ThenInclude(ro => ro.Images)
                .Include(o => o.RentObj)
                    .ThenInclude(ro => ro.ParamValues)
                .FirstOrDefaultAsync(o => o.id == id);
        }

        public override async Task<List<Offer>> GetEntitiesAsync(params string[] includeProperties)
        {
            using var db = new OfferContext();

            return await db.Offers
                //.Include(o => o.OfferOrderLinks)
                //.Include(o => o.BookedDates)
                .Include(o => o.RentObj)
                    .ThenInclude(ro => ro.Images)
                .Include(o => o.RentObj)
                    .ThenInclude(ro => ro.ParamValues)
                .ToListAsync();
        }


        public async Task<int> AddOfferWithRentObjAndParamValuesAsync(Offer offer)
        {
            if (offer.RentObj?.ParamValues != null)
            {
                foreach (var param in offer.RentObj.ParamValues)
                {
                    param.ValueString ??= string.Empty;
                }
            }

            using var db = new OfferContext();

            db.Offers.Add(offer);
            await db.SaveChangesAsync();

            return offer.id;
        }


        public async Task<int> UpdateOfferWithRentObjAndParamValuesAsyn(Offer offer)
        {
            using var db = new OfferContext();

            var existingOffer = await db.Offers
                .Include(o => o.RentObj)
                    .ThenInclude(r => r.ParamValues)
                .Include(o => o.RentObj)
                    .ThenInclude(r => r.Images)
                .FirstOrDefaultAsync(o => o.id == offer.id);

            if (existingOffer == null)
                throw new Exception($"Offer with id={offer.id} not found");

            db.Entry(existingOffer).CurrentValues.SetValues(offer);

            if (existingOffer.RentObj == null)
            {
                existingOffer.RentObj = offer.RentObj;
            }
            else
            {
                db.Entry(existingOffer.RentObj)
                    .CurrentValues
                    .SetValues(offer.RentObj);
            }

            // =======================
            // 4. ParamValues
            // =======================

            var existingParams = existingOffer.RentObj.ParamValues;
            var newParams = offer.RentObj.ParamValues ?? new List<RentObjParamValue>();

            // Удаляем старые
            foreach (var existing in existingParams.ToList())
            {
                if (!newParams.Any(p => p.id != 0 && p.id == existing.id))
                {
                    db.RentObjParamValues.Remove(existing);
                }
            }

            // Обновляем или добавляем новые
            foreach (var param in newParams)
            {
                if (param.id == 0)
                {
                    param.RentObjId = existingOffer.RentObj.id;
                    existingParams.Add(param);
                }
                else
                {
                    var existing = existingParams.FirstOrDefault(p => p.id == param.id);
                    if (existing != null)
                        db.Entry(existing).CurrentValues.SetValues(param);
                }
            }


            // =======================
            // 5. Images
            // =======================

            var existingImages = existingOffer.RentObj.Images;
            var newImages = offer.RentObj.Images ?? new List<RentObjImage>();

            foreach (var existing in existingImages.ToList())
            {
                if (!newImages.Any(i => i.id == existing.id))
                {
                    db.RentObjImages.Remove(existing);
                }
            }

            foreach (var img in newImages)
            {
                var existing = existingImages.FirstOrDefault(i => i.id == img.id);

                if (existing == null)
                {
                    existingImages.Add(img);
                }
                else
                {
                    db.Entry(existing).CurrentValues.SetValues(img);
                }
            }

            await db.SaveChangesAsync();
            return offer.id;
        }


        //==================================================================================================================

        public async Task<List<int>> GetOrdersIdLinkToOffer(int offerId)
        {
            await using var db = new OfferContext();

            var offer = await db.Offers
                .FirstOrDefaultAsync(x => x.id == offerId);

            if (offer == null)
                return null;


            var existsList =  db.OfferOrderLinks
                .Where(x => x.OfferId == offerId).Select(x=>x.OrderId).ToList();
            return existsList;
        }

        //==================================================================================================================

        public async Task<bool> AddOrderLinkToOffer(int offerId, int orderId)
        {
            await using var db = new OfferContext();

            var client = await db.Offers
                .FirstOrDefaultAsync(x => x.id == offerId);

            if (client == null)
                return false;


            var exists = await db.OfferOrderLinks
                .AnyAsync(x => x.OfferId == offerId && x.OrderId == orderId);

            if (exists)
                return false;

            var offerOrder = new OfferOrderLink
            {
                OfferId = offerId,
                OrderId = orderId
            };

            db.OfferOrderLinks.Add(offerOrder);
            await db.SaveChangesAsync();

            return true;
        }


        //==================================================================================================================
        public async Task<List<Offer>> SearchOffersAsync([FromQuery] OfferSearchRequestByCityAndCountGuest request)
        {
            var fitOffers = new List<Offer>();
            var totalGuests = request.Adults + request.Children;
            try
            {
                using var db = new OfferContext();

                 fitOffers = await db.Offers
                    .Include(o => o.RentObj)
                        .ThenInclude(ro => ro.Images)
                    .Include(o => o.RentObj)
                        .ThenInclude(ro => ro.ParamValues)
                    .Where(o => o.RentObj != null &&
                                o.RentObj.CityId == request.CityId &&
                                o.MaxGuests >= totalGuests)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                //throw new Exception("An error occurred while retrieving offers", ex);
                Console.WriteLine("Exception message: " + ex.Message);
                Console.WriteLine("Stack trace: " + ex.StackTrace);
                throw; 
            }
            return fitOffers;
        }

        //==================================================================================================================

        public async Task<List<Offer>> GetOffersByOwnerIdAsync(int ownerId)
        {
            var fitOffers = new List<Offer>();
            try
            {
                using var db = new OfferContext();
                fitOffers = await db.Offers
                   //.Include(o => o.OfferOrderLinks)
                   //.Include(o => o.BookedDates)
                   .Include(o => o.RentObj)
                        .ThenInclude(ro => ro.Images)
                   .Include(o => o.RentObj)
                        .ThenInclude(ro => ro.ParamValues)
                   .Where(o => o.OwnerId == ownerId)
                   .ToListAsync();
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                //throw new Exception("An error occurred while retrieving offers", ex);
            }
            return fitOffers;
        }

        //public async Task<List<Offer>> GetOffersByIdAsync(List<int> ids)
        //{
        //    var fitOffers = new List<Offer>();
        //    try
        //    {
        //        using var db = new OfferContext();
        //        fitOffers = await db.Offers
        //           //.Include(o => o.OfferOrderLinks)
        //           //.Include(o => o.BookedDates)
        //           .Include(o => o.RentObj)
        //                .ThenInclude(ro => ro.Images)
        //           .Include(o => o.RentObj)
        //                .ThenInclude(ro => ro.ParamValues)
        //           .Where(o => o.id == ids)
        //           .ToListAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the exception (not implemented here)
        //        //throw new Exception("An error occurred while retrieving offers", ex);
        //    }
        //    return fitOffers;
        //}
        //==================================================================================================================

        public async Task<List<Offer>> GetOffersByOwnerIdAndCityAsync(int ownerId, int cityId)
        {
            var fitOffers = new List<Offer>();
            try
            {
                using var db = new OfferContext();
                fitOffers = await db.Offers
                  //.Include(o => o.OfferOrderLinks)
                   //.Include(o => o.BookedDates)
                   .Include(o => o.RentObj)
                        .ThenInclude(ro => ro.Images)
                   .Include(o => o.RentObj)
                        .ThenInclude(ro => ro.ParamValues)
                   .Where(o => o.RentObj.CityId == cityId)
                   .Where(o => o.OwnerId == ownerId)
                   .ToListAsync();
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                //throw new Exception("An error occurred while retrieving offers", ex);
            }
            return fitOffers;
        }


        //==================================================================================================================

        public async Task<List<Offer>> GetOffersByOwnerIdAndCountryAsync(int ownerId, int countryId)
        {
            var fitOffers = new List<Offer>();
            try
            {
                using var db = new OfferContext();
                fitOffers = await db.Offers
                   //.Include(o => o.OfferOrderLinks)
                   //.Include(o => o.BookedDates)
                   .Include(o => o.RentObj)
                        .ThenInclude(ro => ro.Images)
                   .Include(o => o.RentObj)
                        .ThenInclude(ro => ro.ParamValues)
                   .Where(o => o.RentObj.CountryId == countryId)
                   .Where(o => o.OwnerId == ownerId)
                   .ToListAsync();
            }
            catch (Exception ex)
            {
                // Log the exception (not implemented here)
                //throw new Exception("An error occurred while retrieving offers", ex);
            }
            return fitOffers;
        }
    }
}
