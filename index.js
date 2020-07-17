import * as networkService from "./services/networkService";
import EnvConfig from "./configs/env";

$(function () {

  const numberRegex = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/
  const isValidNumber = function (s) {
    return numberRegex.test(s);
  };

  let exChangeRate = 0;

  initiateProject();

  function initiateProject() {
    const defaultSrcSymbol = EnvConfig.TOKENS[0].symbol;
    const defaultDestSymbol = EnvConfig.TOKENS[1].symbol;

    initiateDropdown();
    initiateSelectedToken(defaultSrcSymbol, defaultDestSymbol);
    initiateDefaultRate(defaultSrcSymbol, defaultDestSymbol);
    initBalances();
  }

  setInterval(()=>{
    initBalances();
    console.log("5s");
  }, 10000)

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', accounts => {
      window.location.reload();
    })
  }

  function initiateDropdown() {
    let dropdownTokens = '';

    EnvConfig.TOKENS.forEach((token) => {
      dropdownTokens += `<div class="dropdown__item">${token.symbol}</div>`;
    });

    $('.dropdown__content').html(dropdownTokens);
  }

  function initiateSelectedToken(srcSymbol, destSymbol) {
    $('#selected-src-symbol').html(srcSymbol);
    $('#selected-dest-symbol').html(destSymbol);
    $('#rate-src-symbol').html(srcSymbol);
    $('#rate-dest-symbol').html(destSymbol);
    $('#selected-transfer-token').html(srcSymbol);
  }

  function initBalances() {
    networkService.getTokenBalances(EnvConfig.TOKENS[0].address).then((result) => {
      const balance = result / Math.pow(10, 18);
      $('#balance__tka').html('token a : ' + balance);
    }).catch(error => {
      console.log(error);
      $('#balance__tka').html('token a : ' + 0);
    })
    networkService.getTokenBalances(EnvConfig.TOKENS[1].address).then((result) => {
      const balance = result / Math.pow(10, 18);
      $('#balance__tkb').html('token b : ' + balance);
    }).catch(error => {
      console.log(error);
      $('#balance__tkb').html('token b : ' + 0);
    })

    networkService.getTokenBalances(EnvConfig.TOKENS[2].address).then((result) => {
      const balance = result / Math.pow(10, 18);
      $('#balance__eth').html('ether : ' + balance);
    }).catch(error => {
      console.log(error);
      $('#balance__eth').html('ether : ' + 0);
    })
  }

  function initiateDefaultRate(srcSymbol, destSymbol) {

    const value = $('#swap-source-amount').val();
    if (srcSymbol == destSymbol) {
      $('#exchange-rate').html(1);
      exChangeRate = 1;
      if(isValidNumber(value)){
        $('.input-placeholder').html(exChangeRate * value);
      }
      return;
    }
  

    const srctoken = findTokenBySymbol(srcSymbol);
    const desttoken = findTokenBySymbol(destSymbol);


    const defaultSrcAmount = (Math.pow(10, 18)).toString();

    networkService.getExchangeRate(srctoken.address, desttoken.address, defaultSrcAmount).then((result) => {
      const rate = result / Math.pow(10, 18);
      $('#exchange-rate').html(rate);
      exChangeRate = rate;
      if(isValidNumber(value)){
        $('.input-placeholder').html(exChangeRate * value);
      }
    }).catch((error) => {
      console.log(error);
      $('#exchange-rate').html(0);
      exChangeRate = 0;
      if(isValidNumber(value)){
        $('.input-placeholder').html(exChangeRate * value);
      }
    });
  }

  function findTokenBySymbol(symbol) {
    return EnvConfig.TOKENS.find(token => token.symbol === symbol);
  }

  $(document).on('click', '.swap__icon', function () {
    const srctoken = $('#selected-src-symbol').text();
    const desttoken = $('#selected-dest-symbol').text();
    initiateSelectedToken(desttoken, srctoken);
    initiateDefaultRate(desttoken, srctoken);
  })

  // on changing token from dropdown.
  $(document).on('click', '.dropdown__item', function () {
    const selectedsymbol = $(this).html();
    const selectedtarget = $(this).parent().siblings('.dropdown__trigger').find('.selected-target');
    selectedtarget.html(selectedsymbol);
    // if(selectedtarget.attr('id') == )
    /* todo: implement changing rate for source and dest token here. */
    const srctoken = $('#selected-src-symbol').text();
    const desttoken = $('#selected-dest-symbol').text();
    initiateSelectedToken(srctoken, desttoken);
    initiateDefaultRate(srctoken, desttoken);
    
   

  });

  // import metamask
  $('#import-metamask').on('click', function () {
    /* todo: importing wallet by metamask goes here. */
    if (window.ethereum) {
      window.ethereum.enable();
    }
  });

  // handle on source amount changed
  $('#swap-source-amount').on('input change', function () {
    /* todo: fetching latest rate with new amount */
    const value = $(this).val();
    if(!isValidNumber(value) && value != ''){
      $('.input-error__swap').text('invalid number.')
      return;
    }else {
      $('.input-error__swap').text('')
      /* todo: updating dest amount */
      // const srcTokenSym = $('#selected-src-symbol').text();
      // const destTokenSym = $('#"selected-dest-symbol').text();
      const value = $('#swap-source-amount').val();
      $('.input-placeholder').html(exChangeRate * value)

    }



  });

  $('#transfer-source-amount').on('input change', function () {
    /* TODO: Fetching latest rate with new amount */
    const value = $(this).val();
    if(!isValidNumber(value) && value != ''){
      $('.input-error__transfer').text('Invalid number.')
      return;
    }else {
      $('.input-error__transfer').text('')
      /* TODO: Updating dest amount */
      
    }



  });
  // handle on click token in token dropdown list
  $('.dropdown__item').on('click', function () {
    $(this).parents('.dropdown').removeClass('dropdown--active');
  });
  // handle on swap now button clicked
  $('#swap-button').on('click', function () {
    // const modalid = $(this).data('modal-id');
    // $(`#${modalid}`).addClass('modal--active');

    const srcTokenSym = $('#selected-src-symbol').text();
    const destTokenSym = $('#selected-dest-symbol').text();
    const value = $('#swap-source-amount').val();
    const srcToken = findTokenBySymbol(srcTokenSym);
    const destToken = findTokenBySymbol(destTokenSym);

    networkService.swapToken(srcToken, destToken, Number(value)).then(res =>{
      console.log(res);
    }).catch(err => {
      console.log(err);
    })

  });

  // tab processing
  $('.tab__item').on('click', function () {
    const contentid = $(this).data('content-id');
    $('.tab__item').removeClass('tab__item--active');
    $(this).addClass('tab__item--active');
    if (contentid === 'swap') {
      $('#swap').addClass('active');
      $('#transfer').removeClass('active');
    } else {
      $('#transfer').addClass('active');
      $('#swap').removeClass('active');
    }
  });

  // dropdown processing
  $('.dropdown__trigger').on('click', function () {
    $(this).parent().toggleClass('dropdown--active');
  });

  // close modal
  $('.modal').on('click', function (e) {
    if (e.target !== this) return;
    $(this).removeClass('modal--active');
  });

  $('#btn-transfer').on('click', function(){
    const tokenSym = $('#selected-transfer-token').text();
    const value = Number($('#transfer-source-amount').val());
    const destAddress = $('#transfer-address').val();
    const token = findTokenBySymbol(tokenSym);
    console.log(token.address, destAddress, value);
    networkService.transferToken(token.address, destAddress, value).then(res =>{
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
   
  })

})
