import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  // Provide a static locale for now
  const locale = 'de-AT';

  return {
    locale,
    messages: {
      // Add minimal messages
      common: {
        title: 'FindMyTherapy',
      },
    },
  };
});
