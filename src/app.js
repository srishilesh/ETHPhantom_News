App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const fake_news = await $.getJSON('Fake_news.json')
      App.contracts.Fake_news = TruffleContract(fake_news)
      App.contracts.Fake_news.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.fake_news = await App.contracts.Fake_news.deployed()
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderNews()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderNews: async () => {
      // Load the total task count from the blockchain
      const newsCount = await App.fake_news.newsCount()
      const $taskTemplate = $('.taskTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= newsCount; i++) {
        // Fetch the task data from the blockchain
        const news = await App.fake_news.tasks(i)
        const newsId = news[0].toNumber()
        const newsContent = news[1]
        const newsCompleted = news[2]
        //const taskCompleted = news[2]
  
        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(newsContent)
        $newTaskTemplate.find('input')
                        .prop('name', newsId)
                        .prop('checked', newsCompleted)
                        .on('click', App.toggleCompleted)
  
        // Put the task in the correct list
        if (newsCompleted) {
          $('#completedTaskList').append($newTaskTemplate)
        } else {
          $('#taskList').append($newTaskTemplate)
        }
  
        // Show the task
        $newTaskTemplate.show()
      }
    },
  
    createTask: async () => {
      App.setLoading(true)
      const content = $('#newTask').val()
      await App.fake_news.createNews(content)
      window.location.reload()
    },
  
    toggleCompleted: async (e) => {
      App.setLoading(true)
      const newsId = e.target.name
      await App.fake_news.toggleCompleted(newsId)
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })
  
