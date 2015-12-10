(function () {
    // the minimum version of jQuery we want
    var v = "1.9.1";
    var url;
    var url_ldme = document.getElementById('witSourceScript').getAttribute('data-origin');

    // Format Data
    function witStripBrackets(a) {
        return a.replace(/ *\([^)]*\) */g, "")
    }
    function witStripTags(input, allowed) {
        allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

        if (typeof (input) != "undefined") {
            return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });
        }
        else {
            return "";
        }
    }
    function witCleanString(string) {
        string = witStripTags(string);
        string = jQuery.trim(string);
        string = string.replace(/&nbsp;/gi, " ");
        string = string.replace(/(\r\n|\n|\r)/gm, " ");
        string = string.replace(/ /g, " ");
        string = string.replace(/ +(?= )/g, '');
        return string;
    }
    function witPriceClean(price) {
        price = price || "";
        price = price.toString();
        price = witStripTags(price);
        price = price.replace(/ /g, " ");
        price = price.replace(/\u20ac/g, ",");
        price = price.replace(/[0-9]{1,2}\%/, "");
        price = price.replace(/[^0-9\.,]/g, "");

        if (price.indexOf(',') !== -1) {
            if (price.indexOf('.') !== -1) {
                price = price.replace(',', '');
            }
            else {
                price = price.replace(',', '.');
            }
        }

        price = price.replace(/\.$/g, '');

        if (price.match(/([0-9]*[,]{1}[0-9]{2})/)) {
            if (price.match(/([0-9]*[.]?[0-9]{2})/)) {
                price = price.replace(/\./, "")
            }
        }

        if (price.match(/([0-9]*[,\.]?[0-9]{2})/)) {
            price = price.replace(/([0-9]*[,\.]?[0-9]{2}).*/, "$1")
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) < 2 && ("" + parseInt(price)) === price || parseFloat(price) > 15000) {
            return "";
        }

        return parseFloat(price);
    }
    function witDescStripTags(input) {
        input = input.replace("</p>", "<br />");
        input = witStripTags(input, "<br /><br>");

        return input;
    }
    function witCleanDesc(desc) {
        if (typeof desc != "undefined" && desc != "undefined") {
            desc = witDescStripTags(desc);
            desc = jQuery.trim(desc);
            desc = desc.replace(/ +(?= )/g, '');
            desc = witCleanString(desc);
        }
        else {
            desc = "Description non disponible";
        }

        return desc;
    }
    function witDescSingleBr(input) {
        input = input.replace("<br><br>", "<br />");

        return input;
    }
    function witFormatStringForWork(b) {
        var a = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
        var c = new RegExp("(\\" + a.join("|\\") + ")", "g");
        return b.replace(c, "\\$1");
    }


    //check for a change in the URL
    function witFrameMessage() {
        var gCurScroll = witScrollPos();
        var hash = location.href.split('#');
        if (hash.length > 1 && hash[hash.length - 1].match('wit') != null) {
            location.replace(hash[0] + "#");
            witSetScroll(gCurScroll);
            witHandleMessage(hash[hash.length - 1]);
        }
    }
    //show the message from the iframe
    function witHandleMessage(msg) {
        witClose();
    }
    //close the box
    function witClose() {
        var witbox = document.getElementById('witBox');
        witbox.parentNode.removeChild(witbox);
        var witscript = document.getElementById('witScript');

        if (typeof (witscript) != "undefined" && witscript != null && typeof (witscript.parentNode) != "undefined") {
            witscript.parentNode.removeChild(witscript);
        }

        window.onscroll = null;
    }


    // Get Data
    // Get Title
    function witGetTitle() {
        var title;
        var haveTitle = false;
        var hostName = window.location.hostname;

        switch (hostName) {
            case "www.aubert.com": if (jQuery(".heading-one").length) { title = jQuery(".heading-one").html(); title = witStripBrackets(title); } break;
            case "www.vertbaudet.fr": title = jQuery("#ctl00_cphZoneActive_InfoProduitPrincipale h1").html(); break;
            case "www.oclio.com": title = jQuery("#content h1").html(); break;
            case "www.king-jouet.com": title = jQuery(".ProduitEntete h1").html(); break;
            case "joueclub.fr":
            case "www.joueclub.fr":
            case "www.joueclub.com":
                {
                    title = jQuery("#ctl00_ContentPlaceHolder1_artDesc").html();
                    break;
                }
            case "www.decobb.com": title = jQuery(".textnomprod").html(); break;
            case "www.natalys.com": title = jQuery("#main h2").html(); break;
            case "www.avenuedesjeux.com": title = jQuery("#middle h1").html(); break;
            case "www.micromania.fr": title = jQuery("#content h2").html(); break;
            case "www.fly.fr": title = jQuery(".product-name h6").html(); break;
            case "www.sephora.fr": title = jQuery("#fiche .titre").html(); break;
            case "madame.lefigaro.fr": if (jQuery(".produit").length) { title = jQuery(".produit .legende").html(); } break;
            case "www.toysrus.fr": title = jQuery("h1").html(); break;
            case "www.doudouplanet.com": title = jQuery("h1").html(); break;
            case "www.zara.com": title = jQuery("h2").html(); break;
            case "luisaviaroma.com":
            case "www.luisaviaroma.com":
                {
                    title = document.title;
                    var a = title.split("LUISAVIAROMA");
                    title = a[0];
                    title = title.replace(/-/gm, " ");
                    title = jQuery.trim(title);
                    break
                }
        }

        if (typeof (title) != "undefined" && title != "") {
            haveTitle = true;
        }

        if (!haveTitle) {
            if (jQuery("h1").length) {
                if (jQuery("h1").length > 1) {
                    title = document.getElementsByTagName("h1")[1].innerHTML
                } else {
                    title = document.getElementsByTagName("h1")[0].innerHTML
                }
            } else {
                title = ""
            }
        }

        if (!(title == "" || title == null || title == undefined)) {
            title = witCleanString(title)
        }

        if (title == "" || title == null || title == undefined) {
            title = document.title
        }

        title = witCleanString(title);

        return title
    }
    // Get Price
    function witGetPrice() {
        var selector_new_price = "[class=newPrice]";
        var selector_price = "[class*=price],[class*=prix],[class*=Price],[id*=prix],[id*=Prix],[id*=price],[id*=Price]";
        var selector_old_price = ".oldprice, #oldprice, .oldPrice, .old-price";
        var selector_body = "body";
        var price = 0;
        var havePrice = false;
        var hostname = window.location.hostname;

        if (jQuery("[itemprop*=price]").length) {
            var havePrice = false;
            jQuery("[itemprop*=price]").each(function () {
                if (havePrice != true) {
                    price = jQuery(this).attr("content");
                    price = witPriceClean(price);

                    if (parseInt(price) > 3) {
                        havePrice = true
                    }
                }
            });
        }

        switch (hostname) {
            case "www.laredoute.fr": price = jQuery(".spanPrice").html() || jQuery(".product_price").html(); break;
            case "www.amazon.fr": price = jQuery(".priceLarge").html() || jQuery("#priceblock_ourprice").html(); break;
            case "www.webdistrib.com": price = jQuery(".prodInfos .price").html(); break;
            case "www.boulanger.fr": price = jQuery("#pp_purchase_scroll_price").html(); break;
            case "www.cdiscount.com": price = jQuery(".price-xx_large").html(); break;
            case "www.kiabi.com": price = jQuery(".prixFP").html(); break;
            case "www.doudouplanet.com": price = jQuery("#centre #prix_final").html() || jQuery(".item_price", "#prix_bebe").html(); break;
            case "www.darty.com": selector_body = "#main"; break;
            case "www.3suisses.fr": price = jQuery("#zonePrix:first").html(); break;
            case "www.sarenza.com": price = jQuery("#divDetailsPrix .price").html(); break;
            case "www.sephora.fr": price = jQuery(".ligneSKU:eq(0) table tr:eq(0) td:eq(2) p.gras").html(); break;
            case "www.toysrus.fr": price = jQuery("dd.ours", "#price").html(); break;
            case "www.natiloo.com": selector_body = "#prod_details"; break;
            case "www.marionnaud.fr":
                {
                    price = jQuery("#fullPrice").html();
                    if (typeof (price) != "undefined") {
                        price = price.trim();
                    }
                    break;
                }
            case "www.ebay.fr":
            case "www.ebay.com":
                {
                    price = jQuery(".actPanel span#prcIsum").html();
                    if (typeof (price) != "undefined") {
                        price = price.replace(/EUR/g, '');
                    }
                    break;
                }
            case "www.cultura.com": price = jQuery(".priceArea .basketArea").html(); break;
            case "www.prenatal.it": price = jQuery('meta[name="zx:amount"]').attr("content"); break;
            case "www.allobebe.fr": price = jQuery(".price").html(); break;
            case "www.salustore.com": price = jQuery(".product-shop .price").html(); break;
            case "www.vertbaudet.fr": price = jQuery(".memo_fp_prix_final").attr('data-price'); break;
            case "www.rueducommerce.fr": price = jQuery(".ficheProduit_info .ficheProduit_prix", "#content").html(); break;
            case "www.eveiletjeux.com":
                {
                    price = parseInt(jQuery(".actions_produit .prix").html()) + "," + jQuery(".actions_produit .prix span").html();
                    if (typeof (price) != "undefined") {
                        price = price.replace(/EUR/g, '');
                    }
                    break;
                }
            case "www.king-jouet.com":
                {
                    if (jQuery(".PrixProduit", "#ProductDetails").length > 0 && jQuery(".exposant", "#ProductDetails").length > 0) {
                        price = parseInt(jQuery(".PrixProduit", "#ProductDetails").html()) + jQuery(".exposant", "#ProductDetails").html();
                        if (typeof (price) != "undefined") {
                            price = price.replace('â‚¬', ',');
                        }
                    }
                    break;
                }
            case "www.conforama.fr": price = jQuery(".newPrice").html(); break;
            case "www.ikea.com": price = jQuery(".packagePrice").html(); break;
            case "www.maisonsdumonde.com": price = jQuery(".price .ecoStrong").html(); break;
            case "fr.loccitane.com":
            case "www.loccitane.com":
                {
                    var line = jQuery(".product_input input[name=product_choice]:checked").parent('.product_input').parent('li');
                    var zone_price = jQuery(line).find(".product_price");
                    price = jQuery(zone_price).find("span:eq(1)").html();
                    break;
                }
            case "www.yoox.com": price = jQuery("span[itemprop='price']").html(); break;
        }

        if (typeof (price) != "undefined" && price != "") {
            havePrice = true;
        }

        if (!havePrice) {
            var a = "";
            var e = "";
            jQuery(selector_body).find(selector_new_price).not(selector_old_price).each(function () {

                a = jQuery(this);

                var l = a.find(selector_price);

                if (l.size() > 0) {
                    return true;
                }

                e = jQuery(selector_price, a);

                if (e.length == 0) {
                    try {
                        var j = a.parents("[id*=nav],[class*=conseil],[class*=other],[class*=autre],[class*=prixBarre]")
                    }
                    catch (k) {
                        var j = ""
                    }

                    if (j.length == 0) {
                        price = a.html();
                        price = witPriceClean(price);
                        if (parseInt(price)) {
                            havePrice = true;
                            return false;
                        }
                    }
                }
            })
        }

        if (!havePrice) {
            var a = "";
            var e = "";
            jQuery(selector_body).find(selector_price).not(selector_old_price).each(function () {

                a = jQuery(this);

                var l = a.find(selector_price);

                if (l.size() > 0) {
                    return true;
                }

                e = jQuery(selector_price, a);
                if (e.length == 0) {
                    try {
                        var j = a.parents("[id*=nav],[class*=conseil],[class*=other],[class*=autre],[class*=prixBarre]")
                    }
                    catch (k) {
                        var j = ""
                    }

                    if (j.length == 0) {
                        price = a.html();
                        price = witPriceClean(price);
                        if (parseInt(price) > 4) {
                            havePrice = true;
                            return false
                        }
                    }
                }
            })
        }

        return price;
    }
    // Get Description
    function witGetDesc() {
        var description = "";
        var selector_desc = "[class*=desc],[class*=descriptif],[class*=description],[id*=desc],[id*=descriptif],[id*=description]";
        var selector_body = "body";
        var haveDesc = false;
        var hostName = window.location.hostname;

        switch (hostName) {
            case "www.aubert.com": if (jQuery("#tabs-1").length > 0) { description = jQuery("#tabs-1").html(); description = witStripTags(description); } break;
            case "www.king-jouet.com": if (jQuery(".BlocFicheProduitContent div").not("div.Attributs").length > 0) { description = jQuery(".BlocFicheProduitContent div").not("div.Attributs").html(); description = witDescSingleBr(description); } break;
            case "www.laredoute.fr": description = jQuery(".divDescription", "#divTab1Content").html(); break;
            case "www.oclio.com": if (jQuery("#content div#product_description").length > 0) { description = jQuery("#content div#product_description").html(); description = witDescStripTags(description); } break;
            case "www.vertbaudet.fr": description = jQuery(".memo_fp_description_sous_titre_1 strong").not("li strong").html(); break;
            case "joueclub.fr":
            case "www.joueclub.fr":
            case "www.joueclub.com":
                {
                    description = jQuery("div#ctl00_ContentPlaceHolder1_pnlProduit table:eq(5) p").find("b").remove("b").end().html();
                    break;
                }
            case "www.decobb.com": description = jQuery("#pdt_prod_desccourt").html(); break;
            case "www.natalys.com": description = jQuery("#product_tabs .tabcontent:eq(0)").html(); break;
            case "www.avenuedesjeux.com": description = jQuery("#a_descriptif").find("span").remove("span").end().html(); break;
            case "www.micromania.fr": description = jQuery("#fiche p").html(); break;
            case "www.sephora.fr": description = jQuery("#intro").html(); break;
            case "www.toysrus.fr": description = jQuery("#description-product-tab p").html(); break;
            case "www.lamaisondevalerie.fr": description = ""; break;
            case "www.marionnaud.fr": if (jQuery("#txt0 .divbar div").length > 0) { description = jQuery("#txt0 .divbar div").html(); description = witStripTags(description); } break;
            case "www.doudouplanet.com":
                {
                    if (jQuery("table div.product_description_flypage").length > 0) {
                        description = jQuery("table div.product_description_flypage").html();
                        description = witDescSingleBr(description);
                    }
                    break;
                }
            case "www.amazon.fr":
            case "www.amazon.com":
                {
                    if (jQuery("div#ps-content div.content #postBodyPS div").length > 0) {
                        description = jQuery("div#ps-content div.content #postBodyPS div").html();
                        description = witDescSingleBr(description);
                    }
                    break;
                }
            case "www.fly.fr":
                {
                    if (jQuery(".technicalDescription").length > 0) {
                        description = jQuery(".technicalDescription").html().trim();
                        description = witDescSingleBr(description);
                    }
                }
            default:
                {
                    if (hostName.search("fnac.com") >= 0) {
                        if (jQuery("div.resumeMarket .inpage_product_desc").length > 0)
                            description = jQuery("div.resumeMarket .inpage_product_desc").html();
                        else if (jQuery("div.resumeMarket .resMarkContent").length > 0)
                            description = jQuery("div.resumeMarket .resMarkContent").html();
                        else if (jQuery("div.avisEdContent").length > 0)
                            description = jQuery("div.avisEdContent").html();
                        else
                            description = "";
                    }
                    break;
                }
        }

        if (typeof (description) != "undefined" && description != "") {
            haveDesc = true;
        }

        // if ( !haveDesc )
        // {
        // var a = "";
        // var e = "";
        // jQuery(selector_body).find(selector_desc).not('a').each(function () {

        // a = jQuery(this);

        // console.log( a );

        // var l = a.find( selector_desc ).not('a');

        // if (l.size() > 0)
        // {
        // return true;
        // }

        // e = jQuery( selector_desc, a ).not('a');
        // if (e.length == 0)
        // {
        // description = a.html();
        // description = witCleanDesc(description);

        // console.log(description);

        // haveDesc = true;
        // return false
        // }
        // });
        // }
        if (haveDesc) {
            description = witCleanDesc(description)
        }

        return description
    }
    // Get Visuel
    function witGetVisuelGiftAuto() {
        var hostName = window.location.hostname;

        switch (hostName) {
            case "www.aubert.com":
                {
                    if (jQuery(".product-big img").length) {
                        witSelectedVisuel = jQuery(".product-big img").attr("src");
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "www.lamaisondevalerie.fr":
            case "www.lamaisondevalerie.com":
                {
                    if (jQuery(".ProductApercu .Vcenter img").length) {
                        witSelectedVisuel = jQuery(".ProductApercu .Vcenter img").attr("src");
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "www.sephora.fr":
                {
                    if (jQuery("#visuel img#grandVisu").length) {
                        witSelectedVisuel = jQuery("#visuel img#grandVisu").attr("src");
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "www.alinea.fr":
                {
                    if (jQuery("#thumbs img").length) {
                        witSelectedVisuel = jQuery("#thumbs img")[0].src;
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "www.marionnaud.fr":
                {
                    if (jQuery(".product_pic img").length) {
                        witSelectedVisuel = jQuery(".product_pic img")[0].src;
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "www.micromania.fr":
                {
                    if (jQuery(".span-10:eq(0) img:eq(0)").length) {
                        witSelectedVisuel = jQuery(".span-10:eq(0) img:eq(0)")[0].src;
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "madame.lefigaro.fr":
                {
                    if (jQuery(".diapo-photo img").length) {
                        witSelectedVisuel = jQuery(".diapo-photo img")[0].src;
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "www.doudouplanet.com":
                {
                    if (jQuery(".product_image_flypage").length) {
                        witSelectedVisuel = jQuery(".product_image_flypage")[0].src;
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "www.amazon.fr":
            case "www.amazon.com":
                {
                    if (jQuery("#main-image").length > 0) {
                        witSelectedVisuel = jQuery("#main-image")[0].src;
                        return witSelectedVisuel;
                    }
                    else if (jQuery("img", "#imgTagWrapperId").length > 0) {
                        witSelectedVisuel = jQuery("img", "#imgTagWrapperId").attr("src");
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "luisaviaroma.com":
            case "www.luisaviaroma.com":
                {
                    if (jQuery("#sp_image").length) {
                        witSelectedVisuel = jQuery("#sp_image")[0].src;
                        return witSelectedVisuel;
                    }
                    break;
                }
            case "www.fly.fr":
                {
                    if (jQuery("#backImageSjElement4_img").length) {
                        witSelectedVisuelUrl = jQuery("#backImageSjElement4_img")[0].src;
                        witSelectedVisuelArray = witSelectedVisuelUrl.split("?");
                        witSelectedVisuel = witSelectedVisuelArray[0];
                        return witSelectedVisuel;
                    }
                    break;
                }
            default:
                {
                    if (hostName.search("fnac.com") >= 0) {
                        if (jQuery('.visual0.listVisual').length) {
                            witSelectedVisuel = jQuery('.visual0.listVisual').css("background-image").split("url(")[1].split(")")[0];
                            return witSelectedVisuel;
                        }
                    }
                    break;
                }

                return null;
        }
    }
    function witGetVisuelGift() {
        var hostName = window.location.hostname;
        var arrayImages = document.getElementsByTagName("img");
        var witMinVisuelSize = 100;
        var witSelectedVisuelHeight = 0;
        var witSelectedVisuel = witGetVisuelGiftAuto();

        var giftTitle = document.title;
        giftTitle = witFormatStringForWork(giftTitle);
        var arrayGiftTitleElements = giftTitle.split(" ");
        var nbElementsArrayTitle = arrayGiftTitleElements.length;
        var f = nbElementsArrayTitle * 0.8;
        var s = 0;
        var g = -1;
        var currentImage = "";
        var currentImageAlt = "";
        var currentImageSrc = "";
        var currentImageHeight = 0;

        if (typeof (witScrapVisuel) == "undefined" || witScrapVisuel == null) {
            witScrapVisuel = witSelectedVisuel;
        }

        if (typeof (jQuery('meta[property="og:image"]').attr("content")) != "undefined" && typeof (jQuery('meta[property="og:image"]:not([content*="video"])')[0]) != "undefined") {
            witScrapVisuel = jQuery('meta[property="og:image"]').attr("content");

            witSelectedVisuel = witScrapVisuel;
        }
        else {
            for (var m = 0; m < arrayImages.length; m++) {
                currentImage = arrayImages[m];
                currentImageAlt = currentImage.alt;
                currentImageSrc = currentImage.src;

                if (typeof (witScrapVisuel) == "undefined" || witScrapVisuel == null) {
                    if (currentImage.width < witMinVisuelSize || currentImage.height < witMinVisuelSize) {
                        continue;
                    }
                    if (currentImageSrc.search("Sprite") > 0 || currentImageSrc.search("sprite") > 0 || currentImageSrc.search("icon") > 0 || currentImageSrc.search("Icon") > 0) {
                        continue;
                    }

                    s = 0;

                    for (var e = 0; e < nbElementsArrayTitle; e++) {
                        if (currentImageAlt.search(arrayGiftTitleElements[e]) >= 0) {
                            if (e < 2) {
                                s += 2;
                            }
                            else {
                                s++;
                            }
                        }
                    }

                    currentImageHeight = currentImage.height;

                    if (currentImageHeight > witSelectedVisuelHeight) {
                        if (s >= g || g < 3) {
                            if (s == g && witSelectedVisuelHeight > 200) {
                                continue
                            }

                            witSelectedVisuel = currentImageSrc;
                            witSelectedVisuelHeight = currentImage.height;

                            g = s;

                            if (s > f) {
                                break
                            }
                        }
                    }
                    else {
                        if (s > g && s > 2) {
                            witSelectedVisuel = currentImageSrc;
                            witSelectedVisuelHeight = currentImage.height;
                            g = s
                        }
                    }
                }
                else {
                    var msieVersion = 0;
                    var msieMode = 0;

                    if (navigator.appVersion.indexOf("MSIE") != -1) {
                        msieVersion = parseFloat(navigator.appVersion.split("MSIE")[1]);
                        msieMode = document.documentMode;
                    }

                    if (msieVersion == 7 || msieMode == 7) {
                        if (currentImage.attributes.src && currentImage.attributes.src == witScrapVisuel) {
                            witSelectedVisuelHeight = currentImage.height;
                        }
                    }
                    else {
                        if (currentImage.hasAttribute("src") && currentImage.getAttribute("src") == witScrapVisuel) {
                            witSelectedVisuelHeight = currentImage.height;
                        }
                    }
                }
            }
        }

        if (witSelectedVisuel && witSelectedVisuel && witSelectedVisuel.match('^\/{1}[a-zA-Z0-9-_?#.]')) {
            witSelectedVisuel = 'http://' + hostName + witSelectedVisuel;
        }

        return witSelectedVisuel;
    }


    // Positionning frame
    // Get the scroll position
    function witSetScroll(pos) {
        var e = document.documentElement, b = document.body;
        e.scrollLeft = b.scrollLeft = pos.x;
        e.scrollTop = b.scrollTop = pos.y;
    }
    // Find the location of the scroll
    function witScrollPos() {
        if (self && self.pageYOffset !== undefined) {
            return {
                x: self.pageXOffset,
                y: self.pageYOffset
            };
        }
        return { x: 0, y: 0 }
    }


    // Get Text for description
    function witGetHighlightedText() {
        var t = "";

        if (window.getSelection) {
            t = window.getSelection();
        }
        else if (document.getSelection) {
            t = document.getSelection();
        }
        else if (document.selection) {
            t = document.selection.createRange().text;
        }

        return t;
    }
    function witMouseupGetDescription() {
        var desc = witGetHighlightedText();

        if (desc != '') {
            var baseUrl = url.split('&witdesc=')[0];
            baseUrl += '&witdesc=' + encodeURIComponent(desc);

            // console.log(document.getElementById("witframe").src)
            // document.getElementById("witframe").src = "http://www.cadeaux.vigi.lan/";
            // console.log(document.getElementById("witframe").src)
            document.getElementById("witframe").src = baseUrl;
            // console.log(document.getElementById("witframe").src)
        }
    }


    // Set Iframe
    function witSetIframe() {
        var iframe;

        if (navigator.userAgent.indexOf("Safari") != -1) {
            iframe = frames["witframe"];
        }
        else {
            iframe = document.getElementsByName("witframe").contentWindow;
            if (iframe = 'undefined')
                iframe = document.getElementById("witframe").contentWindow;
            // alert('Test');
        }

        if (!iframe)
            return;

        url = url_ldme + '/wit.html';
        url += '#wit?giftname=' + encodeURIComponent(witGetTitle());
        url += '&witlocation=' + encodeURIComponent(window.location.href);
        url += '&witimg=' + encodeURIComponent(witGetVisuelGift());
        url += '&witdesc=' + encodeURIComponent(witGetDesc());
        url += '&witprice=' + encodeURIComponent(witGetPrice());

        try {
            iframe.location.replace(url);
        }
        catch (e) {
            iframe.location = url; // safari
        }
    }
    // Init WIT
    function initWIT() {
        (window.myBookmarklet = function () {
            if (window.location.origin != url_ldme) {
                if (document.getElementById('witBox'))
                    witClose();

                var heightBox = 627;
                var windowHeight = $(window).height();
                var marginTopInit = heightBox / 2;
                var marginTopScroll;

                var container = document.createElement("div");
                container.id = "witBox";
                container.style.padding = "0";
                container.style.margin = "0";
                container.style.border = "none";
                // container.style.position = "absolute";
                container.style.position = "fixed";
                container.style.top = "50%";
                //container.style.top = "0";
                // container.style.marginTop = ( witScrollPos().y - marginTopInit ) + "px";
                container.style.marginTop = -(parseInt(heightBox) / 2) + "px";
                container.style.right = "0";
                container.style.zIndex = 100000;
                container.style.width = "396px";
                container.style.height = heightBox + "px";
                container.style.backgroundColor = "white";
                container.style.boxShadow = "-8px 2px 12px #aaa";

                if (heightBox > windowHeight) {
                    marginTopInit = 0;

                    container.style.height = windowHeight + "px";
                    container.style.top = "0";
                    container.style.marginTop = "0px";
                }

                container.innerHTML = '<iframe style="width:100%;height:100%;border:0px;" name="witframe" id="witframe"></iframe>';

                document.body.appendChild(container);

                //set up message checking to run every so often
                var interval = window.setInterval(function () {
                    witFrameMessage();
                }, 50);

                witSetIframe();

                // window.onscroll = function()
                // {
                // marginTopScroll = witScrollPos().y - marginTopInit;
                // document.getElementById('witBox').style.marginTop = marginTopScroll + "px";
                // };

                // $(window).bind("mouseup", witMouseupGetDescription);

            }
            else {
                alert("Pour installer So, glissez-dÃ©posez le lien dans votre barre de favoris.");
            }
        })();
    }


    // check prior inclusion and version
    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        var done = false;
        var script = document.createElement("script");
        script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                initWIT();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        initWIT();
    }

})();