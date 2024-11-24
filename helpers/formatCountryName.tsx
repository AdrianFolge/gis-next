export default function formatCountryName(countryName: string) {
    if (countryName.includes(' ')) {
      return countryName.toLowerCase().replace(/\s+/g, '-');
    } else {
      return countryName.toLowerCase();
    }
  }