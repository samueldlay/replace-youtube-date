/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Type guard
// Ref: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
function exists<T> (maybeValue: T): maybeValue is NonNullable<T> {
  return maybeValue !== null && maybeValue !== undefined;
  // null == undefined
  // return maybeValue != null;
}

function assert (expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new Error(msg);
}

function replaceDate () {
  const infoContainer = document.getElementById("info-container");
  assert(exists(infoContainer), "Info container not found");
  const originalDate = infoContainer.querySelectorAll("span.style-scope")[2];
  assert(exists(originalDate), "Original date not found");
  const showAll = document.getElementById("expand");
  assert(exists(showAll), "Show all button not found");
  showAll.click();
  const actualDate = infoContainer.querySelectorAll("span.style-scope")[2]?.textContent;
  assert(exists(actualDate), "Actual date not found");
  const collapse = document.getElementById("collapse");
  assert(exists(collapse), "Collapse button not found");
  collapse.click();
  originalDate.textContent = actualDate;
}

function handleYTNavigation () {
  // TODO(Sam): Use Mutation Observer
  setTimeout(replaceDate, 3000);
}

window.addEventListener("yt-navigate-finish", handleYTNavigation);
