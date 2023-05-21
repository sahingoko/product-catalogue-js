(function () {

    PC.pages.releaseNote = {}
    
    /**
     * Renders the products list page
     *
     * The products list page can optionally be filtered by a category, and will
     * then only show products from that category. This is only used from the
     * categories page, in order to render lists of products with only products
     * from a selected category.
     */
    
    PC.pages.releaseNote.renderHTML = function (params) {
      var query = {
        content_type: PC.config.releaseNoteID,
        include: 2
        }
    
       return PC.contentfulClient.getEntries(query)
      .then(function (entries) {
        return entries.items.map(renderReleaseNote).join('\n')
      })
    }
    
    function renderReleaseNote(releaseNote) {
       return '<h1>' +releaseNote.fields.title +'</h1>'+
        '<div class="products">' +
        marked(releaseNote.fields.mdIntroduction) +
        releaseNote.fields.sections.map(renderSingleSection).join('\n') +
        '</div>'
    }
    
    function renderSingleSection(section) {
      var fields = section.fields
      return '<div class="product-in-list">' +
         '<div class="product-header">'+'<h2>'+
         fields.componentName +'</h2>'+
         '<p>'+
         fields.features.map(renderRNFeatureDetails).join('\n') +'</p>'+
        '</div>' +
      '</div>'
    }
    
    function renderRNFeatureDetails(fields) {
      return  renderFeatureHeader(fields.fields) +
        '<p class="product-categories">' +
        '</p>'+ marked(fields.fields.mdDescription)
             
        
    }
    
    function renderFeatureHeader(fields) {
      return '<div class="product-header">' +
        '<h3 >' +
             fields.title +
         '</h3>' +
       '</div>'
    }
    
    
    
    }());
    