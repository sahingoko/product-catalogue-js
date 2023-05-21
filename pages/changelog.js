(function () {

    PC.pages.changelog = {}
    
    /**
     * Renders the products list page
     *
     * The products list page can optionally be filtered by a category, and will
     * then only show products from that category. This is only used from the
     * categories page, in order to render lists of products with only products
     * from a selected category.
     */
    
    PC.pages.changelog.renderHTML = function (params) {
      var query = {
        content_type: PC.config.featureDescriptionID,
        order:'-fields.releaseDate'
        }
    
       return PC.contentfulClient.getEntries(query)
      .then(function (entries) {
        return renderFeatures(entries.items)
      })
    }
    
    function renderFeatures(features) {
      return '<h1>Changelog</h1>' +
        '<div class="products">' +
        features.map(renderSingleFeature).join('\n') +
        '</div>'
    }
    
    function renderSingleFeature(feature) {
      var fields = feature.fields
      return '<div class="product-in-list">' +
         '<div class="product-details">' +
         renderFeatureDetails(fields) +
        '</div>' +
      '</div>'
    }
    
    function renderFeatureDetails(fields) {
      const areTags= fields.tags
      let  result
      return renderFeatureHeader(fields) +
        '<p class="product-categories">' +'<h3>' +
        fields.title + '</h3>' +
        (areTags ? fields.tags.map(renderTags).join(' '): result="" ) +
        '</p>' +'<p>'+
        marked(fields.mdSummary) 
        '</p>'
             
        
    }
    function renderTags(tag)
    {
      if (tag)
          return '<code>'+tag+'</code>'+ '&nbsp;'
      else  
          return
      }
    
    function renderFeatureHeader(fields) {
      options = { year: 'numeric', month: 'short', day: 'numeric' };
      var dt = new Date(fields.releaseDate);
      var dt_st = dt.toLocaleDateString("en-US",options);
      return '<div class="product-header">' +
        '<h2 >' +
        dt_st+
         '</h2>' +
       '</div>'
    }
    
    
    
    }());
    