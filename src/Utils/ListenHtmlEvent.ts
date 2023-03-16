type ListenHtmlEventReturn = {
  removeListener: () => void;
};

// const ListenHtmlEvent=(target:HTMLElement|Window,event:keyof HTMLElementEventMap | keyof WindowEventMap,handle:()=>any|Promise<any>):Return=>{
const ListenHtmlEvent = (
  element: HTMLElement | Window | Document,
  event: string | EventTarget,
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
):ListenHtmlEventReturn => {
  element.addEventListener(event as string, handler,options);

  return {
    removeListener: () => element.removeEventListener(event as string, handler,options),
  };
};

export default ListenHtmlEvent;
