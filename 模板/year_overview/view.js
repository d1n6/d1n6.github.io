/**
 * Script needs following input:
 * pages - list of pages that should be used as data source. if no color function is given, page.day must be set
 * year - year to render as a number
 * color - either a string that represents the color that should be used if a page with page.day for this day is available
 *         or a function that gets the date to fill as a argument and needs to return a string to use as color
 * tooltipFn - (optional) a function that gets the date to fill as argument and needs to return a string
 */
const emptyColor = 'rgba(200, 200, 200, 0.15)';
const pages = dv.pages('"日记"');

let date = dv.luxon.DateTime.utc(input.year);
const calendar = [];
for (let i = 1; i <= 12; i++) {
  calendar[i] = [];
}

while (date.year == input.year) {
  calendar[date.month].push(getDayEl(date, determineColor(date), generateTooltip(date)));
  date = addOneDay(date);
}

// == Render calendar ==
calendar.forEach((month, i) => {
  const monthEl = `<span class="monthLabel">${dv.luxon.DateTime.utc(input.year, i).toFormat('MMM')}</span>`;
  dv.el('div', monthEl + month.reduce((acc, curr) => `${acc} ${curr}`, ''), { cls: 'month' });
});

function addOneDay(date) {
  return dv.luxon.DateTime.fromMillis(date + dv.duration('1d'));
}

function getDayEl(date, color, tooltip) {
  return `<span class="day" style="--background: ${color}" title="${tooltip}"></span>`;
}

function getMetaColor(meta, opacity) {
  if (meta == "行") {
    return `rgba(255, 71, 111, ${opacity})`;
  }
  if (meta == "财") {
    return `rgba(255, 209, 102, ${opacity})`;
  }
  if (meta == "健") {
    return `rgba(6, 214, 160, ${opacity})`;
  }
  if (meta == "学") {
    return `rgba(17, 138, 255, ${opacity})`;
  }                                                                                                                                                                                                                                                                                                                                                 
  if (meta == "人") {
    return `rgba(218,112,214, ${opacity})`;
  }
  return emptyColor;
}


function determineColor(date) {
  const meta = input.meta
  const page = pages.find(p => p[meta] && p.file.day.startOf('day').equals(date.startOf('day')));
  if (page) {
    let opacity = 1;
    if (typeof page[meta] === 'number') {
      opacity = page[meta]
    }
    if (input.color && typeof input.color === 'function') {
      return input.color(opacity);
    }
    return getMetaColor(meta, opacity);
  }
  return emptyColor;
}

function generateTooltip(date) {
  let tooltip = '';
  if (input.tooltipFn) {
    tooltip = input.tooltipFn(date);
  } else {
    const page = pages.find(p => p.file.day.startOf('day').equals(date.startOf('day')));
    const meta = input.meta
    const num = page? page[meta] : '';
    return date.toFormat('yyyy-MM-dd') + ': ' + num;
  }

  return tooltip;
}
