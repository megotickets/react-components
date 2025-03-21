export const isConnectedWithMego = () => {
    //Search provider in url params (loggedAs or signedAs)
    const urlParams = new URLSearchParams(window.location.search);
    const loggedAs = urlParams.get('loggedAs');
    const signedAs = urlParams.get('signedAs');
    return loggedAs || signedAs
}

export const getProvider = () => {
    //Search provider in url params (loggedAs or signedAs)
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');
    return provider
}