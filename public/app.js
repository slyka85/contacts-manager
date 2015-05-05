console.log("LINKED");
$(function() {
  var $container = $(".container");
  var $dynamicDiv = $(".dynamic");
  var $home = $(".welcome");
  var $contacts = $(".contacts");
  var $contactsTbody = $("#contactsTBody");
  var $tbodyCat = $("#categoriesTBody");
  var $categories = $(".categories");
  var $categoryDropDown = $("#categoryOption");
  var $about = $(".about");
  var $menu = $(".navMenu");
  var $circleManu = $("#navs")
  var $template = $('script[data-id="contactsTemplate"]').text();
  var $templateCat = $('script[data-id="categoriesTemplate"]').text();
  var ul = $("#navs"),
    li = $("#navs li"),
    i = li.length,
    n = i - 1,
    r = 120;
  ul.click(openMenu);
  ////////////////////////////////////////////////////////////////
  function home() {
      $dynamicDiv.empty();
      var str = "Welcome to Contact Manager!";
      var spans = '<span>' + str.split(/\s+/).join(' </span><span>') + '</span>';
      $(spans).hide().appendTo($dynamicDiv).each(function(i) {
        $(this).delay(1000 * i).fadeIn();
      });
      $dynamicDiv.hide().show("slow");
      $dynamicDiv.append($home);
    } // end of home function
    //////////////////////////////////////////////////////////////
  function showContacts() {
      $dynamicDiv.empty();
      $dynamicDiv.hide().show("slow");
      $dynamicDiv.append($contacts);
      $.ajax({
        method: "GET",
        url: "/contacts"
      }).done(function(contacts) {
        $.ajax({
          method: "GET",
          url: "/categories"
        }).done(function(categories) {
          var contactsEls = contacts.map(function(contact) {
              contact.categories = categories;
              return Mustache.render($template, contact);
            }) //end of map
          if ($('tbody').children().length == 0) {
            $('tbody').append(contactsEls);
          } //end of if
        }); //end of done categories
      }); //end of done contacts
      // $("#contactsTBody").sortable();
      $('section').on('click', '[data-action="createContact"]', createContact);
      $('tbody').on('click', '[data-action="saveContact"]', saveContact);
      $('tbody').on('click', '[data-action="deleteContact"]', deleteContact);
    } //end of showContacts function
    //////////////////////////////////////////////////////////////
  function showCategories() {
      $dynamicDiv.empty();
      $dynamicDiv.hide().show("slow");
      $dynamicDiv.append($categories);
      $.ajax({
        method: "GET",
        url: "/categories"
      }).done(function(categories) {
        var categoryEls = categories.map(function(category) {
          return Mustache.render($templateCat, category);
        })
        if ($tbodyCat.children().length == 0) {
          $tbodyCat.append(categoryEls);
        }
      });
      $('section').on('click', '[data-action="createCategory"]', createCategory);
      $tbodyCat.on('click', '[data-action="saveCategory"]', saveCategory);
      $tbodyCat.on('click', '[data-action="deleteCategory"]', deleteCategory);
    } //end of showCategories function
    //////////////////////////////////////////////////////////////
  function about() {
      $dynamicDiv.empty();
      $dynamicDiv.hide().show("slow");
      $dynamicDiv.append($about);
    } //end of about function
    //////////////////////////////////////////////////////////////
  function deleteCategory(event) {
      var row = $(event.target).parents('tr');
      var id = row.attr('data-id');
      var url = '/categories/' + id;
      $.ajax({
          type: "DELETE",
          url: url,
          contentType: 'application/json',
          beforeSend: function() {
            row.children().animate({
              'backgroundColor': '#CC0066'
            }, 300);
          },
        }).done(function(data) {
          row.children().slideUp(300, function() {
            row.remove();
          })
        }) //end of done
    } //end of deleteCategory function
    //////////////////////////////////////////////////////////////
  function createCategory(e) {
      $('html, body').animate({
        scrollTop: $(document).height()
      }, 'slow');
      var row = $(e.target).parents('tr');
      var id = row.attr('data-id');
      var categoryName = row.find('[data-attr="categoryName"]').text().trim();
      var categoryInfo = JSON.stringify({
        categoryName: categoryName,
      });
      var myEscapedJSONString = categoryInfo.escapeSpecialChars();
      $.ajax({
          method: "POST",
          url: "/categories",
          data: myEscapedJSONString,
          contentType: 'application/json'
        }).done(function(data) {
          var html = Mustache.render($templateCat, data);
          $tbodyCat.append(html);
        }) //end of done POST
    } //end of createCategory function
    //////////////////////////////////////////////////////////////
  function saveCategory(e) {
      var row = $(e.target).parents('tr');
      var id = row.attr('data-id');
      var categoryName = row.find('[data-attr="categoryName"]').text().trim();
      var categoryInfo = JSON.stringify({
        categoryName: categoryName,
      });
      var myEscapedJSONString = categoryInfo.escapeSpecialChars();
      $.ajax({
          method: "PUT",
          url: "/categories/" + id,
          data: myEscapedJSONString,
          contentType: 'application/json'
        }).done(function(data) {}) //end of done
      $(this).css({
        background: 'grey'
      });
      $(this).hide().show("slow");
    } //end of saveCategory function
    //////////////////////////////////////////////////////////////
  function deleteContact(event) {
      var row = $(event.target).parents('tr');
      var thisID = row.attr('data-id');
      var url = '/contacts/' + thisID;
      $.ajax({
          type: "DELETE",
          url: url,
          contentType: 'application/json',
          beforeSend: function() {
            row.children().animate({
              'backgroundColor': '#CC0066'
            }, 300);
          },
        }).done(function() {
          row.children().slideUp(300, function() {
            row.remove();
          })
        }) //end of done
    } //end of deleteContact function
    //////////////////////////////////////////////////////////////
  function saveContact(e) {
      var row = $(e.target).parents('tr');
      var id = row.attr('data-id');
      var contactName = row.find('[data-attr="contactName"]').text().trim();
      var contactPhone = row.find('[data-attr="phone"]').text().trim();
      var contactEmail = row.find('[data-attr="email"]').text().trim();
      var contactCity = row.find('[data-attr="city"]').text().trim();
      var contactCategory = row.find('.chosenCat').val();
      var contactInfo = JSON.stringify({
        contactName: contactName,
        phone: contactPhone,
        email: contactEmail,
        city: contactCity,
        categorieId: contactCategory
      });
      var myEscapedJSONString = contactInfo.escapeSpecialChars();
      $.ajax({
          method: "PUT",
          url: "/contacts/" + id,
          data: myEscapedJSONString,
          contentType: 'application/json'
        }).done(function() {}) //end of done
      $(this).css({
        background: 'grey'
      });
      $(this).hide().show("slow");
    } //end of saveContact function
    //////////////////////////////////////////////////////////////
  function createContact(e) {
      $('html, body').animate({
        scrollTop: $(document).height()
      }, 'slow');
      var row = $(e.target).parents('tr');
      var id = row.attr('data-id');
      var contactName = row.find('[data-attr="contactName"]').text().trim();
      var contactPhone = row.find('[data-attr="phone"]').text().trim();
      var contactEmail = row.find('[data-attr="email"]').text().trim();
      var contactCity = row.find('[data-attr="city"]').text().trim();
      var contactCategory = row.find('.chosenCat').val();
      var contactInfo = JSON.stringify({
        contactName: contactName,
        phone: contactPhone,
        email: contactEmail,
        city: contactCity,
        categorieId: parseInt(contactCategory),
      });
      var myEscapedJSONString = contactInfo.escapeSpecialChars();
      $.ajax({
          method: "POST",
          url: "/contacts",
          data: contactInfo,
          contentType: 'application/json'
        }).done(function(data) {
          $.ajax({
            method: "GET",
            url: "/categories"
          }).done(function(categories) {
            data.categories = categories;
            var html = Mustache.render($template, data);
            $('tbody').append(html);
          }); //end of done categories
        }) //end of done POST
    } //end of createContact function
    //////////////////////////////////////////////////////////////  
  function openMenu() {
      $(this).toggleClass('active');
      if ($(this).hasClass('active')) {
        for (var a = 0; a < i; a++) {
          li.eq(a).css({
            'transition-delay': "" + (50 * a) + "ms",
            '-webkit-transition-delay': "" + (50 * a) + "ms",
            'left': (r * Math.cos(90 / n * a * (Math.PI / 180))),
            'top': (-r * Math.sin(90 / n * a * (Math.PI / 180)))
          });
        } //end of loop
      } else {
        li.removeAttr('style');
      }
    } //end of openMenu
    ///////////////////////////////////////////////////////////////
  String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "")
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f")
      // .replace(/ /g, "")
  };
  ////////////////////////      ROUTER      /////////////////////
  var routes = {
    "/": home,
    "/contacts": showContacts,
    "/categories": showCategories,
    "/about": about
  }
  var router = Router(routes);
  router.init();
});
/////////////////////////////////////////////////////////////////
