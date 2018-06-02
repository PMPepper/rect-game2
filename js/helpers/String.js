//-formatting methods
export function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

export function formatDataSize(bytes, format, asArray = false, culture = null) {
  format = (format === true) ? 'si' : (format === false ? 'nonSI' : format);

  if(typeof(bytes) !== 'number') {
    throw new Error('bytes must a number, value is: "'+bytes+'"');
  }

  var thresh = format === 'si' ? 1000 : 1024;
   if(Math.abs(bytes) < thresh) {
       return bytes + ' B';//this space SHOULD be an nbsp
   }
   var units = format != 'nonSI'
       ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
       : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
   var u = -1;
   do {
       bytes /= thresh;
       ++u;
   } while(Math.abs(bytes) >= thresh && u < units.length - 1);

   const mag = Math.floor(Math.log10(bytes));
   const decimalPlaces = Math.max(0, 2 - mag);

   const formatOptions = {minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces};
   const formattedNumber = formatNumber(bytes, null, culture, formatOptions);

   return asArray ? [formattedNumber, units[u]] : formattedNumber+' '+units[u];//this space SHOULD be an nbsp
}

//cache for number format objects
const defaultNumberformat = new Intl.NumberFormat();

const numberFormatCulture = {};

export function formatNumber(n, decimalPlaces = null, culture = null, options = null) {
  if(typeof(decimalPlaces) == 'number') {
    n = roundTo(n, decimalPlaces);
  }

  if(culture || options) {
    if(!(culture instanceof Intl.NumberFormat)) {
      //culture = new Intl.NumberFormat(culture || undefined, options || undefined);

      const cultureKeyName = (culture || '__default__') + '::' + (options ? window.JSON.stringify(options) : '{}' );

      if(numberFormatCulture.hasOwnProperty(cultureKeyName)) {
        culture = numberFormatCulture[cultureKeyName];
      } else {
        culture = numberFormatCulture[cultureKeyName] = new Intl.NumberFormat(culture || undefined, options || undefined);
      }
    }
  } else {
    culture = defaultNumberformat;
  }

  return culture.format(n);
}

export function formatDuration(seconds, localisation, langCode) {
  const timeParts = splitTimeIntoParts(seconds);
  let formatName = null;

  if(timeParts.days > 2) {
    formatName = 'timeperiod-format-days';
  } else if(timeParts.totalHours > 2) {
    formatName = 'timeperiod-format-hours';
  } else if(timeParts.totalMinutes > 2) {
    formatName = 'timeperiod-format-minutes';
  } else {
    formatName = 'timeperiod-format-seconds';
  }

  return localisation.formatString(localisation[formatName], timeParts);
}

export function splitTimeIntoParts(time) {
  time = Math.round(time);
  let output = [];

  const seconds = time%60;

  const minutes = Math.floor((time % 3600)/60);

  const hours = Math.floor((time % 86400) / 3600);

  const days = Math.floor(time/86400);

  const totalSeconds = time;
  const totalMinutes = Math.floor(time / 60);
  const totalHours = Math.floor(time / 3600);
  const totalDays = days;

  return {seconds, minutes, hours, days, totalSeconds, totalMinutes, totalHours, totalDays};
}

export function formatBytesPerSecond(bps, localisation) {
  return bps;//TODO
}

//-string functions
export function caseInsensitiveStringComparison(str1, str2, langCode = null) {
  return str1.localeCompare(str2, langCode, {sensitivity: 'accent'}) === 0;
}

export function stringHash(str) {
  var hash = 0, i, chr;

  if (str.length === 0) return hash;

  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

export function splitAtFirst(str, searchStr) {
  return str.split(new Regex(escapeRegExp(searchStr)+'(.+)'))
}


//-regex methods
export function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

//TODO prevent repeat
export function randomString(length, possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  var text = "";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
