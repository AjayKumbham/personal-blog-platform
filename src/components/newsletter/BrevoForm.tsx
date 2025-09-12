import React, { useEffect } from 'react';

interface BrevoFormProps {
  className?: string;
}

const BrevoForm: React.FC<BrevoFormProps> = ({ className = '' }) => {
  useEffect(() => {
    // Add Brevo styles to head if not already present
    if (!document.querySelector('link[href*="sib-styles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://sibforms.com/forms/end-form/build/sib-styles.css';
      document.head.appendChild(link);
    }

    // Add custom styles for better integration
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: block;
        font-family: Roboto;
        src: url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/7529907e9eaf8ebb5220c5f9850e3811.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/25c678feafdc175a70922a116c9be3e7.woff) format("woff")
      }
      
      @font-face {
        font-display: fallback;
        font-family: Roboto;
        font-weight: 600;
        src: url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/6e9caeeafb1f3491be3e32744bc30440.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/71501f0d8d5aa95960f6475d5487d4c2.woff) format("woff")
      }
      
      @font-face {
        font-display: fallback;
        font-family: Roboto;
        font-weight: 700;
        src: url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/3ef7cf158f310cf752d5ad08cd0e7e60.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/ece3a1d82f18b60bcce0211725c476aa.woff) format("woff")
      }
      
      #sib-container input:-ms-input-placeholder {
        text-align: left;
        font-family: Helvetica, sans-serif;
        color: #c0ccda;
      }
      
      #sib-container input::placeholder {
        text-align: left;
        font-family: Helvetica, sans-serif;
        color: #c0ccda;
      }
      
      #sib-container textarea::placeholder {
        text-align: left;
        font-family: Helvetica, sans-serif;
        color: #c0ccda;
      }
      
      #sib-container a {
        text-decoration: underline;
        color: #2BB2FC;
      }
    `;
    document.head.appendChild(style);

    // Add Brevo script if not already present
    if (!document.querySelector('script[src*="main.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://sibforms.com/forms/end-form/build/main.js';
      script.defer = true;
      document.body.appendChild(script);

      // Set global variables for Brevo
      (window as any).REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
      (window as any).LOCALE = 'en';
      (window as any).EMAIL_INVALID_MESSAGE = 'The information provided is invalid. Please review the field format and try again.';
      (window as any).REQUIRED_ERROR_MESSAGE = 'This field cannot be left blank.';
      (window as any).GENERIC_INVALID_MESSAGE = 'The information provided is invalid. Please review the field format and try again.';
      (window as any).AUTOHIDE = false;
    }
  }, []);

  return (
    <div className={className}>
      {/* Brevo Form */}
      <div className="sib-form" style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
        <div id="sib-form-container" className="sib-form-container">
          <div
            id="error-message"
            className="sib-form-message-panel"
            style={{
              fontSize: '16px',
              textAlign: 'left',
              fontFamily: 'Helvetica, sans-serif',
              color: '#661d1d',
              backgroundColor: '#ffeded',
              borderRadius: '3px',
              borderColor: '#ff4949',
              maxWidth: '540px'
            }}
          >
            <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
              <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
              </svg>
              <span className="sib-form-message-panel__inner-text">
                Your subscription could not be saved. Please try again.
              </span>
            </div>
          </div>

          <div
            id="success-message"
            className="sib-form-message-panel"
            style={{
              fontSize: '16px',
              textAlign: 'left',
              fontFamily: 'Helvetica, sans-serif',
              color: '#085229',
              backgroundColor: '#e7faf0',
              borderRadius: '3px',
              borderColor: '#13ce66',
              maxWidth: '540px'
            }}
          >
            <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
              <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
              </svg>
              <span className="sib-form-message-panel__inner-text">
                Your subscription has been successful.
              </span>
            </div>
          </div>

          <div
            id="sib-container"
            className="sib-container--large sib-container--vertical"
            style={{
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              maxWidth: '540px',
              borderRadius: '12px',
              borderWidth: '1px',
              borderColor: 'rgba(255,255,255,0.2)',
              borderStyle: 'solid',
              direction: 'ltr',
              backdropFilter: 'blur(10px)'
            }}
          >
            <form
              id="sib-form"
              method="POST"
              action="https://62abc80e.sibforms.com/serve/MUIFADUYWcA1EWsi-aIpRk1Sw_-bGpnLmFTKAJo8j0sMvtXEnerHZxASAv9N08xno9ynbAHw-i3V83WDAWlKN_Tgu_5zg7zjX9kwX-yc1I_4f1HroxhpDK-hFY1ZUr7klgegYAZcG_pjjtv_0KDhCL2J-gaC8eLX8iqCvc0ohi4l9qMV5MQLxG9Y1YS-_qp0hFRujt7PQ36uWhyJ"
              data-type="subscription"
            >
              <div style={{ padding: '8px 0' }}>
                <div className="sib-form-block" style={{
                  fontSize: '32px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontFamily: 'Helvetica, sans-serif',
                  color: '#ffffff',
                  backgroundColor: 'transparent'
                }}>
                  <p>Newsletter</p>
                </div>
              </div>

              <div style={{ padding: '8px 0' }}>
                <div className="sib-form-block" style={{
                  fontSize: '16px',
                  textAlign: 'center',
                  fontFamily: 'Helvetica, sans-serif',
                  color: 'rgba(255,255,255,0.8)',
                  backgroundColor: 'transparent'
                }}>
                  <div className="sib-text-form-block">
                    <p>Subscribe to our newsletter and stay updated.</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '8px 0' }}>
                <div className="sib-input sib-form-block">
                  <div className="form__entry entry_block">
                    <div className="form__label-row">
                      <label
                        className="entry__label"
                        style={{
                          fontWeight: 700,
                          textAlign: 'left',
                          fontSize: '16px',
                          fontFamily: 'Helvetica, sans-serif',
                          color: '#ffffff'
                        }}
                        htmlFor="EMAIL"
                        data-required="*"
                      >
                        Enter your email address to subscribe
                      </label>

                      <div className="entry__field">
                        <input
                          className="input"
                          type="text"
                          id="EMAIL"
                          name="EMAIL"
                          autoComplete="off"
                          placeholder="EMAIL"
                          data-required="true"
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '16px'
                          }}
                        />
                      </div>
                    </div>

                    <label className="entry__error entry__error--primary" style={{
                      fontSize: '16px',
                      textAlign: 'left',
                      fontFamily: 'Helvetica, sans-serif',
                      color: '#661d1d',
                      backgroundColor: '#ffeded',
                      borderRadius: '3px',
                      borderColor: '#ff4949'
                    }}>
                    </label>

                    <label className="entry__specification" style={{
                      fontSize: '12px',
                      textAlign: 'left',
                      fontFamily: 'Helvetica, sans-serif',
                      color: 'rgba(255,255,255,0.6)'
                    }}>
                      Provide your email address to subscribe. For e.g abc@xyz.com
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ padding: '8px 0' }}>
                <div className="sib-form-block" style={{ textAlign: 'left' }}>
                  <button
                    className="sib-form-block__button sib-form-block__button-with-loader"
                    style={{
                      fontSize: '16px',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontFamily: 'Helvetica, sans-serif',
                      color: '#FFFFFF',
                      background: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
                      borderRadius: '8px',
                      borderWidth: '0px',
                      padding: '12px 24px',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                    form="sib-form"
                    type="submit"
                  >
                    <svg className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512" style={{}}>
                      <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                    </svg>
                    SUBSCRIBE
                  </button>
                </div>
              </div>

              <input type="text" name="email_address_check" value="" className="input--hidden" />
              <input type="hidden" name="locale" value="en" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrevoForm;