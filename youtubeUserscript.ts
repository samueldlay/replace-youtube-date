class AssertionError extends Error {
  override name = "AssertionError";
}

function assert (expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new AssertionError(msg);
}

// Type guard
// Ref: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
function exists<T> (maybeValue: T): maybeValue is NonNullable<T> {
  return maybeValue !== null && maybeValue !== undefined;
  // null == undefined
  // return maybeValue != null;
}

function delay (ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

type WaitForOptions = Partial<{
  interval: number;
  retryCount: number;
}>;

async function waitFor<T> (
  callback: () => T,
  {
    interval = 100,
    retryCount = 8,
  }: WaitForOptions = {},
): Promise<Awaited<T>> {
  let cause: unknown = undefined;
  for (let i = retryCount; i > 0; i -= 1) {
    try {
      return await callback();
    } catch (ex) {
      cause = ex;
    }
    await delay(interval);
  }
  throw new Error(`Timeout exceeded`, {cause});
}

const $ = <T extends Element = Element> (
  selector: string,
  root: ParentNode = document,
): T | null => root.querySelector(selector);

const $$ = <T extends Element = Element> (
  selector: string,
  root: ParentNode = document,
): T[] => [...root.querySelectorAll<T>(selector)];

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

// TODO(Sam): Use Mutation Observer
async function handleYTNavigation () {
  setTimeout(replaceDate, 3000);
  // await waitFor(() => {
  //   const targetElement = $("#info-container span.style-scope:nth-of-type(3)");
  //   assert(exists(targetElement), "Target element not found");
  // });

  // replaceDate();
}

window.addEventListener("yt-navigate-finish", handleYTNavigation);
