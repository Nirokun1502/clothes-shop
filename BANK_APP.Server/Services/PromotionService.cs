using CLOTHES_SHOP.Server.Data;
using CLOTHES_SHOP.Server.DTOs;
using CLOTHES_SHOP.Server.Interfaces;
using CLOTHES_SHOP.Server.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System;

namespace CLOTHES_SHOP.Server.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly DataContext _context;

        public PromotionService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<object>?> GetAllPromotions()
        {
            var promotions = await _context.PROMOTION
            .Include(p => p.Products)
            .Select(promotion => new
            {
                PromotionId = promotion.Promotion_Id,
                PromotionName = promotion.Promotion_Name,
                StartDate = promotion.Start_Date,
                EndDate = promotion.End_Date,
                PromotionProducts = promotion.Products
                .Select(product => new
                {
                    Product = product,
                    PromotionPercentage = _context.PROMOTION_DETAILS
                        .Where(pd => pd.Promotion_Id == promotion.Promotion_Id && pd.Product_Id == promotion.Promotion_Id)
                        .Select(pd => pd.Percentage)
                        .FirstOrDefault()
                }).ToList()
            })
            .ToListAsync();

            List<object> result = promotions.Cast<object>().ToList();

            return result;
        }

        public async Task<object?> GetPromotionById(int id)
        {
            var promotion = await _context.PROMOTION
              .Where(p => p.Promotion_Id == id)
              .Select(promotion => new
              {
                  PromotionId = promotion.Promotion_Id,
                  PromotionName = promotion.Promotion_Name,
                  StartDate = promotion.Start_Date,
                  EndDate = promotion.End_Date,
                  PromotionProducts = promotion.Products
                  .Select(product => new
                  {
                      Product = product,
                      PromotionPercentage = _context.PROMOTION_DETAILS
                        .Where(pd => pd.Promotion_Id == promotion.Promotion_Id && pd.Product_Id == promotion.Promotion_Id)
                        .Select(pd => pd.Percentage)
                        .FirstOrDefault()
                  })
              .ToList()
              })
              .FirstOrDefaultAsync();

            if (promotion == null)
            {
                return null;
            }

            return promotion;
        }

        public async Task<Promotion?> AddPromotion(PromotionDTO request)
        {
            DateTime startDate;
            DateTime endDate;

            if (request.Promotion_Name == "" ||
                request.Start_Date == "" ||
                request.End_Date == "" ||
                !DateTime.TryParseExact(request.Start_Date,
                       "dd/MM/yyyy",
                       CultureInfo.InvariantCulture,
                       DateTimeStyles.None,
                       out startDate) ||
                !DateTime.TryParseExact(request.End_Date,
                       "dd/MM/yyyy",
                       CultureInfo.InvariantCulture,
                       DateTimeStyles.None,
                       out endDate)
                || startDate > endDate
                )
            {
                return null;
            }

            Promotion promotion = new Promotion();
            promotion.Promotion_Name = request.Promotion_Name;
            promotion.Start_Date = startDate;
            promotion.End_Date = endDate;

            _context.PROMOTION.Add(promotion);
            await _context.SaveChangesAsync();

            return promotion;
        }

        public async Task<Promotion?> UpdatePromotionById(int id, PromotionDTO request)
        {
            DateTime startDate;
            DateTime endDate;
            if (request.Promotion_Name == "" ||
                request.Start_Date == "" ||
                request.End_Date == "" ||
                !DateTime.TryParseExact(request.Start_Date,
                       "dd/MM/yyyy",
                       CultureInfo.InvariantCulture,
                       DateTimeStyles.None,
                       out startDate) ||
                !DateTime.TryParseExact(request.End_Date,
                       "dd/MM/yyyy",
                       CultureInfo.InvariantCulture,
                       DateTimeStyles.None,
                       out endDate)
                || startDate > endDate
                )
            {
                return null;
            }

            var promotion = await _context.PROMOTION.FindAsync(id);
            if (promotion == null)
            {
                return null;
            }

            promotion.Promotion_Name = request.Promotion_Name;
            promotion.Start_Date = startDate;
            promotion.End_Date = endDate;
            await _context.SaveChangesAsync();

            return promotion;
        }

        public async Task<List<Promotion>?> DeletePromotionById(int id)
        {
            var promotion = await _context.PROMOTION.FindAsync(id);
            if (promotion == null)
            {
                return null;
            }

            _context.PROMOTION.Remove(promotion);
            await _context.SaveChangesAsync();

            return await _context.PROMOTION.ToListAsync();
        }

        public async Task<Promotion?> AddProductPromotionById(Promotion_Details request)
        {
            if(request.Percentage <= 0)
            {
                return null;
            }

            var promotion = await _context.PROMOTION
              .Where(a => a.Promotion_Id == request.Promotion_Id)
              .Include(a => a.Products)
              .FirstOrDefaultAsync();

            if (promotion == null)
            {
                return null;
            }

            var product = await _context.PRODUCT.FindAsync(request.Product_Id);
            if (product == null)
            {
                return null;
            }

            var promotionDetail = await _context.PROMOTION_DETAILS
               .Where(c => c.Promotion_Id == request.Promotion_Id
                   && c.Product_Id == request.Product_Id)
               .FirstOrDefaultAsync();

            if (promotionDetail != null)
            {
                return null;
            }

            Promotion_Details newItem = new Promotion_Details();
            newItem.Promotion_Id = request.Promotion_Id;
            newItem.Product_Id = request.Product_Id;
            newItem.Percentage = request.Percentage;

            _context.PROMOTION_DETAILS.Add(newItem);
            await _context.SaveChangesAsync();

            return promotion;

        }

        public async Task<Promotion_Details?> UpdateProductPromotionById(Promotion_Details request)
        {
            if (request.Percentage <= 0)
            {
                return null;
            }

            var promotionDetail = await _context.PROMOTION_DETAILS
               .Where(c => c.Promotion_Id == request.Promotion_Id
                   && c.Product_Id == request.Product_Id)
               .FirstOrDefaultAsync();

            if (promotionDetail == null)
            {
                return null;
            }

            promotionDetail.Percentage = request.Percentage;
            await _context.SaveChangesAsync();

            return promotionDetail;
        }

        public async Task<Promotion?> DeleteProductPromotionById(int productId, int promotionId)
        {
            var promotion = await _context.PROMOTION
                .Where(a => a.Promotion_Id == promotionId)
                .Include(a => a.Products)
                .FirstOrDefaultAsync();

            if (promotion == null)
            {
                return null;
            }

            var product = await _context.PRODUCT.FindAsync(productId);
            if (product == null)
            {
                return null;
            }

            var promotionDetail = await _context.PROMOTION_DETAILS
               .Where(c => c.Promotion_Id == promotionId
                && c.Product_Id == productId)
               .FirstOrDefaultAsync();

            if (promotionDetail == null)
            {
                return null;
            }

            promotion.Products.Remove(product);
            await _context.SaveChangesAsync();

            return promotion;
        }



    }
}
