/**
 * Created by m.chekryshov on 18.08.16.
 *
 * Monkey patcher for adfox-loader functions.
 * Provide ability to spy for ads calls from nightwatch tests
 */
module.exports = function(AdfoxLoader) {
  if(!AdfoxLoader){
    return console.error('AdfoxLoaderSpy: AdfoxLoader is not defined');
  }

  AdfoxLoader.init = createSpy(AdfoxLoader, 'init');
}

function createSpy(context, methodName) {
  const targetFunc = context[methodName];

  return function patched() {
    patched.callsLog = patched.callsLog || [];

    const argsArray = [].slice.call(arguments);
    patched.callsLog.push(argsArray);

    targetFunc.apply(context, argsArray);
  }
}
