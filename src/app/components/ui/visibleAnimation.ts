interface Options {request:(cb:FrameRequestCallback)=>number;cancel:(id:number)=>void;hidden:()=>boolean;reduced:()=>boolean}
/** A decorative loop must not use CPU in hidden tabs or when motion is disabled. */
export function createVisibleAnimation(draw:FrameRequestCallback,options:Options){
 let frame:number|null=null,stopped=false;
 function cancel(){if(frame!==null){options.cancel(frame);frame=null;}}
 function tick(now:number){frame=null;if(stopped||options.hidden())return;draw(now);if(!options.reduced())frame=options.request(tick);}
 return {refresh(){if(stopped)return;cancel();if(options.hidden())return;if(options.reduced())draw(performance.now());else frame=options.request(tick);},stop(){stopped=true;cancel();}};
}
