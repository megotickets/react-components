  //Firma con Apple 
  export const signMessageWithApple = (origin: string, challange: string, encoded: boolean = false) => {
    localStorage.setItem("reddeemWithMego", "1");
    if (window)
      //@ts-expect-error typing bug
      window.location = `https://wallet.mego.tools/auth/apple?origin=${origin.replace("http://", "").replace("https://", "")}&message=${challange}${encoded ? "&encoded=true" : ""}`;
  };

  //Firma con Google
  export const signMessageWithGoogle = (origin: string, challange: string, encoded: boolean = false) => {
    localStorage.setItem("redeemWithMego", "1");
    if (window)
      //@ts-expect-error typing bug
      window.location = `https://wallet.mego.tools/auth/google?origin=${origin.replace("http://", "").replace("https://", "")}&message=${challange}${encoded ? "&encoded=true" : ""}`;
  };

  export const signMessageWithPopupGoogle = async (origin: string, challenge: string, encoded: boolean = false): Promise<{ error: boolean, signature: string }> => {
    try {
      const url = `https://wallet.mego.tools/auth/google?origin=${origin.replace("http://", "").replace("https://", "")}&message=${challenge}${encoded ? "&encoded=true" : ""}`;
      const popup = window.open(url, 'megoSignPopup', 'width=500,height=600');

      if (!popup) {
        return { error: true, signature: "" };
      }

      const signature = await new Promise<string>((resolve, reject) => {
        const interval = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(interval);
              reject(new Error("Popup chiuso dall'utente"));
              return;
            }

            if (popup.location.href.includes(origin)) {
              const urlParams = new URLSearchParams(popup.location.search);
              const signature = urlParams.get('signature');

              if (signature) {
                clearInterval(interval);
                popup.close();
                resolve(signature);
              }
            }
          } catch (error) {
            return { error: true, signature: "" };
          }
        }, 500);
      });

      return { error: false, signature };
    } catch (error) {
      return { error: true, signature: "" };
    }
  };

  export const signMessageWithPopupApple = async (origin: string, challenge: string, encoded: boolean = false): Promise<{ error: boolean, signature: string }> => {
    try {
      const url = `https://wallet.mego.tools/auth/apple?origin=${origin.replace("http://", "").replace("https://", "")}&message=${challenge}${encoded ? "&encoded=true" : ""}`;
      const popup = window.open(url, 'megoSignPopup', 'width=500,height=600');

      if (!popup) {
        return { error: true, signature: "" };
      }

      const signature = await new Promise<string>((resolve, reject) => {
        const interval = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(interval);
              reject(new Error("Popup chiuso dall'utente"));
              return;
            }

            if (popup.location.href.includes(origin)) {
              const urlParams = new URLSearchParams(popup.location.search);
              const signature = urlParams.get('signature');

              if (signature) {
                clearInterval(interval);
                popup.close();
                resolve(signature);
              }
            }
          } catch (error) {
            return { error: true, signature: "" };
          }
        }, 500);
      });

      return { error: false, signature };
    } catch (error) {
      return { error: true, signature: "" };
    }
  };