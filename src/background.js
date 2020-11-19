'use strict';

/**
 * @param {string} url
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/set
 */
async function setOver18Cookie({ url, domain, firstPartyDomain, storeId })
{
  try {
    const firstPartyIsolate = await browser.privacy.websites.firstPartyIsolate.get({});

    const cookie = await browser.cookies.set({
      name: 'over18',
      value: '1',
      url,
      domain,
      firstPartyDomain: firstPartyIsolate.value ? firstPartyDomain : '',
      path: '/',
      httpOnly: false,
      secure: true,
      storeId,
    });

    return cookie;
  } catch (error) {
    console.error( error );

    throw error;
  }
}

async function setCookies()
{
  const stores = await browser.cookies.getAllCookieStores();

  const promises = [];

  const domainDetails = {
    domain: '.reddit.com',
    firstPartyDomain: 'reddit.com',
  };

  const urls = [
    'https://www.reddit.com/',
    'https://old.reddit.com/',
  ];

  stores.forEach( store => {
    urls.forEach( url => {
      promises.push(
        setOver18Cookie({
          ...domainDetails,
          url,
          storeId: store.id,
        }),
      );
    });
  });

  const results = await Promise.allSettled( promises );

  return results;
}

function onFirstPartyIsolateChange({ value })
{
  console.log(`privacy.firstparty.isolate has been changed to ${value}`);

  setCookies();
}

function onWindowCreated(/* window */)
{
  setCookies();
}

/**
 * Firefox does not fire this event from manual changes in about:config
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/types/BrowserSetting/onChange
 */
browser.privacy.websites.firstPartyIsolate.onChange.addListener( onFirstPartyIsolateChange );

/**
 * This will not fire for incognito windows unless "Run in Private Windows" is set to "Allow"
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/onCreated
 */
browser.windows.onCreated.addListener( onWindowCreated );

setCookies();
