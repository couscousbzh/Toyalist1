namespace ToyalistAPIV4.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class GiftModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.GiftLists",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        OwnerUserId = c.String(),
                        Name = c.String(),
                        TotalPrice = c.String(),
                        IsOwnerTheBeneficary = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Gifts",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        OwnerUserId = c.String(),
                        GiftListId = c.String(maxLength: 128),
                        Url = c.String(),
                        Name = c.String(),
                        Price = c.String(),
                        Currency = c.String(),
                        Description = c.String(),
                        ImageURL = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.GiftLists", t => t.GiftListId)
                .Index(t => t.GiftListId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Gifts", "GiftListId", "dbo.GiftLists");
            DropIndex("dbo.Gifts", new[] { "GiftListId" });
            DropTable("dbo.Gifts");
            DropTable("dbo.GiftLists");
        }
    }
}
