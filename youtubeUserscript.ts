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
  const elementWithDate = document.getElementById("description-inner")
    ?.children[1]
    ?.children[0] as HTMLDivElement | undefined;
  assert(exists(elementWithDate), "Element with date not found");

  const actualDateText = elementWithDate.textContent?.split("•")[1]?.trim();
  assert(actualDateText, "Date text not found");

  const span = document.querySelector(
    "div#info-container > yt-formatted-string.style-scope > span:nth-of-type(3)",
  );
  assert(exists(span), "Relative date element not found");

  span.textContent = actualDateText;
  console.log(actualDateText);
}

function handleYTNavigation () {
  // TODO(Sam): Use Mutation Observer
  setTimeout(replaceDate, 3000);
}

window.addEventListener("yt-navigate-finish", handleYTNavigation);
