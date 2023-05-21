(function () {

  /**
   * Initializes the application and required dependencies, such as:
   * - Contentful client
   * - Configuration for the application
   * - History API event listeners
   * - Event delegation for handling anchor links throughout the app and allowing
   * navigation through the use of pushState and the History API
   */
  PC.init = function () {
    // Initializes the Contentful client with the required credentials for a
    // product catalog space. Feel free to replace them with our own.
    PC.contentfulClient = contentful.createClient({
      accessToken: 'ayILxcfz2Zi5tkI0P40EAm_F23J8KT3uW28U66VUXPY',
      space: '95qr1uym2jyw',
      host: 'preview.contentful.com'
    })
    console.log('Contentful Client created')
    // IDs of some of the Content Types used in the app
    PC.config = {
      productContentTypeId: 'product',
      categoryContentTypeId: 'category',
      featureDescriptionID:'featureDescription',
      releaseNoteID:'releaseNote'
    }
    setupHistory()
    setupNavAnchorListeners()
    // main container for rendering the app
    PC.container = document.getElementById('content')
  
    // load the requested route
    loadPage(window.location.href)
  }
  
  // Navigates to a given page via the history API
  PC.navigate = function (href) {
    window.history.pushState({href: href}, '', href)
    loadPage(href)
  }
  
  /**
   * Sets up the popstate listener
   * https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
   */
  function setupHistory() {
    window.onpopstate = function (ev) {
      loadPage(ev.state && ev.state.href || '')
      console.log('************** setupHistory')
    }
  }
  
  /**
   * Event delegation mechanism for links throughout the app
   *
   * Listens to all click events in the app, and if the source element is an anchor
   * tag and has a data-nav property, it cancels the event and loads the page
   * referred in the href with the loadPage function, while also pushing it
   * to the history API
   */
  function setupNavAnchorListeners() {
    document.querySelector('body').addEventListener('click', function (ev) {
      ev.preventDefault()
      if(ev.target.tagName.toLowerCase() === 'a' && 'nav' in ev.target.dataset) {
        PC.navigate(ev.target.href)
      }
    }, false)
    console.log('************** setupNavAnchorListeners')
  }
  
  /**
   * Basic routing mechanism
   *
   * Removes the URL from the href (which can come from either an anchor tag or
   * the popstate event), and splits it by '/'.
   */
  function loadPage(href) {
    href = href.replace(document.baseURI, '')
    var urlParts = href.split('/')
    var pageName = urlParts[0]
    // Attempts to get the object which contains the methods to render and setup
    // pages, otherwise defaults to the main page
    console.log('PAGE NAME  : ', pageName)
    var page = PC.pages[pageName] || PC.pages.changelog
    console.log("Changelog Page 1:",page)
    var loader
    switch(pageName) {
      // /categories and /categories/:id
      case 'changelog':
        console.log("Changelog Page:",page)
        loader = page.renderHTML()
        break
      case 'releaseNote':
        loader = page.renderHTML()
        break
      // /product/:id
      default:
        console.log('Default Page')
        loader = page.renderHTML()
    }
  
    loader.then(injectInPage).then(function () {
      // after rendering is done, run the postRender method if there is one
      if('postRender' in page) {
        setTimeout(function () {
          page.postRender()
        }, 0)
      }
    })
  }
  
  function injectInPage (HTMLContent) {
    PC.container.innerHTML = HTMLContent
  }
  
  }());
  