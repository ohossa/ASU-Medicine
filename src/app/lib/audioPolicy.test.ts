import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { feedbackSoundEnabled, prepareMixableAudio, setFeedbackSoundEnabled, isIPhoneSafari } from './audioPolicy';
const iphone='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1';
describe('device-aware feedback audio', () => {
 beforeEach(()=>{localStorage.clear();});
 afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
 it.each([
  ['desktop Safari','Mozilla/5.0 (Macintosh) Version/18.0 Safari/605.1.15'],
  ['Android Chrome','Mozilla/5.0 (Linux; Android 14) Chrome/130.0 Mobile Safari/537.36'],
  ['iPad Safari','Mozilla/5.0 (iPad; CPU OS 18_0) Version/18.0 Safari/604.1'],
  ['iPhone Chrome',iphone.replace('Version/18.0','CriOS/130.0')],
  ['iPhone Firefox',iphone.replace('Version/18.0','FxiOS/130.0')],
 ])('defaults sound on for %s',(_,ua)=>{vi.spyOn(navigator,'userAgent','get').mockReturnValue(ua);expect(isIPhoneSafari()).toBe(false);expect(feedbackSoundEnabled()).toBe(true);expect(prepareMixableAudio()).toBe(true);});
 it('defaults iPhone Safari to silent without preloading or opening audio',()=>{vi.spyOn(navigator,'userAgent','get').mockReturnValue(iphone);expect(isIPhoneSafari()).toBe(true);expect(feedbackSoundEnabled()).toBe(false);expect(prepareMixableAudio()).toBe(false);});
 it('honours explicit unmute even on older iPhone Safari without audioSession',()=>{vi.spyOn(navigator,'userAgent','get').mockReturnValue(iphone);setFeedbackSoundEnabled(true);expect(feedbackSoundEnabled()).toBe(true);expect(prepareMixableAudio()).toBe(true);});
 it('preserves explicit mute on desktop',()=>{setFeedbackSoundEnabled(false);expect(feedbackSoundEnabled()).toBe(false);});
 it('requests ambient mixing before audio starts',()=>{const session={type:'auto'};vi.stubGlobal('navigator',{userAgent:iphone,audioSession:session});setFeedbackSoundEnabled(true);expect(prepareMixableAudio()).toBe(true);expect(session.type).toBe('ambient');});
 it('keeps an explicit sound choice if the experimental session setter fails',()=>{const session={get type(){return 'auto';},set type(_value:string){throw new Error('unsupported');}};vi.stubGlobal('navigator',{userAgent:iphone,audioSession:session});setFeedbackSoundEnabled(true);expect(prepareMixableAudio()).toBe(true);});
 it('retains the in-memory choice when storage is blocked',()=>{vi.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new Error('blocked');});vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked');});setFeedbackSoundEnabled(true);expect(feedbackSoundEnabled()).toBe(true);setFeedbackSoundEnabled(false);expect(feedbackSoundEnabled()).toBe(false);});
});
