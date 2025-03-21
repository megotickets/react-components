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