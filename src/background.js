/**
 * @param {string} url
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/set
 */
async function setOver18Cookie( url )
{
  try {
    const domain = '.reddit.com';
    const firstPartyIsolate = await browser.privacy.websites.firstPartyIsolate.get({});
    const firstPartyDomain = firstPartyIsolate.value ? 'reddit.com' : '';

    const cookie = await browser.cookies.set({
      name: 'over18',
      value: '1',
      url,
      domain,
      firstPartyDomain,
      path: '/',
      httpOnly: false,
      secure: true,
    });

    return cookie;
  } catch (error) {
    console.error( error );

    throw error;
  }
}

async function init()
{
  await Promise.allSettled([
    setOver18Cookie('https://www.reddit.com/'),
    setOver18Cookie('https://old.reddit.com/'),
  ]);
}

function onFirstPartyIsolateChange({ value })
{
  console.log(`privacy.firstparty.isolate has been changed to ${value}`);

  init();
}

/**
 * Firefox does not fire this event from manual changes in about:conig
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/types/BrowserSetting/onChange
 */
browser.privacy.websites.firstPartyIsolate.onChange.addListener( onFirstPartyIsolateChange );

init();
