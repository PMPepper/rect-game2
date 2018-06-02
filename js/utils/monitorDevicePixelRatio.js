import {resolveObjPath} from '../helpers/Object';

export default function monitorDevicePixelRatio(store, valuePath, action) {
  setInterval(() => {
    const curPixelRatio = resolveObjPath(store.getState(), valuePath);

    if(curPixelRatio !== window.devicePixelRatio) {
      store.dispatch(action(window.devicePixelRatio));
    }
  }, (1000 / 60) * 5);//check once every 5 frames
}
