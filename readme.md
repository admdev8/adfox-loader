# adfox-loader.js
Pure js адаптер без таймаутов и mutationobserver для библиотеки по работе с рекламными баннерами capirs.js
### Назначение
- Перезагрузка баннеров
- Отложенная загрузка баннеров
- Сallback - **onBannerLoaded**, позволяющий маркировать проданные и пустые рекламные места (см. JIRA:SSP-434)
- Создание единого интерфейса по управлению рекламными местами
- Проверка готовности ассинхронной версии  capirs.js
- Тестирование рекламных вызовов (см. adfox-loader-spy.js)
### Совместимость

Browsers:

тестировалось в IE 10+

Libs:

//ssp.rambler.ru/capirs_async.js

//ssp.rambler.ru/capirs.js

На 16.12.2016. Версии неизвестны.

### Использование

 Минимальный inline
```html
<!DOCTYPE html>
<html>
    <head>
        <script src="./adfox-loader.js"/>
        <script src="//ssp.rambler.ru/lpdid.js">
        <script src="//ssp.rambler.ru/capirs_async.js "/>
    </head>
    <body>
        <h1>My First Heading</h1>
        <div id="banner"></div>
        <script>
            AdfoxLoader.init("banner", options.common, options.begun, "show");
        </script>
        <p>My first paragraph.</p>
        <script src='application.js'/>
    </body>
</html>
```
С шаблонизатором
```twig
{% macro adfox_base(name, containerClass = '', loadingMethod = 'show', unreloadable = false) %}
    {% set containerId = 'adfox_baner_'~random() %}
    <div id="{{ containerId }}" class="{{ unreloadable ?  containerClass : 'js-reloadable-banner ' + containerClass }}">
         <script>
        (function() {
            var options = {{ get_advert_params_ssp(name) | raw }};
            if (!options.common || !options.begun || !options.begun['begun-auto-pad']) {
                console.error('Adfox-base.twig: "{{ name }}" banner has no required params');
            }
            window.isAdblockDisabled &&
            window.AdfoxLoader &&
            AdfoxLoader.init('{{ containerId }}', options.common, options.begun, '{{ loadingMethod }}');
        })();
    </script>
    </div>
{% endmacro %}
```
```html
<body>
        <h1>My First Heading</h1>
        {{ Adfox.adfox_base('235x42-(13)', 'js-adfox-235x42') }}
        <p>My first paragraph.</p>
</body>
```
Наличие спец класса в примере выше, позволяет использовать интерфейс перезагрузки/загрузки рекламных мест, чтобы например, перезагрузить все баннеры разом.

```javascript
$('.js-reloadable-banner.loaded').each(function() { this.reloadBanner();});
```

И тд. например, иницилизация непосредвенно из application.js чтобы избежать замедления отрисовки или по условию.

### Варианты инициализации рекламного места
С интерфейсом библиотеки carpis.js можно ознакомиться по ссылке: https://confluence.rambler-co.ru/pages/viewpage.action?pageId=27337323
AdfoxLoader, проксирует этот интерфейс, незначительно расширяя его.

После выхода ssp версии библиотеки, чтобы обрести независимость от переменования однотипных методов библиотеки
был создан следующий mapping:
```javascript
var LoadingMethods = {
    'show': 'ssp',
    'showPostpone': 'ssp', // для отложенного вызова по условию
    'showOnScroll': 'sspScroll',
    'showOnScrollPostpone': 'sspScroll', , // для отложенного вызова по условию
    'loadRich': 'sspRich',
    'default': 'ssp'
  };
```

Методы содержащие постфикс **Postpone** предназначены для случаев когда вызов баннера осуществляется по условию (по возможности избегайте этого).

```html
<body>
        <h1>My First Heading</h1>
        {{ Adfox.adfox_base('235x42-(13)', 'js-adfox-235x42', 'showOnScrollPostpone') }}
        <script src='application.js'/>
</body>
```

**application.js**:

 ```javascript
 !isKnownUser && $(".js-adfox-235x42")[0].loadBanner();
```

 Теперь только незарегистрированный клиент увидит js-adfox-235x42 после доскрола до нужного места.
### Публичные методы и свойства
#### AdfoxLoader.init
 
Метод инициализации рекламного места одним из способов указанных в разделе "Варианты инициализации".
После иницизации на dom элементе доступны:
 ```javascript
 AdfoxLoader.init(el.id, options.common, options.begun, "showPostpone");

 el.loadBanner();   // теперь вызовем баннер. Первый http запрос. (вызов с методом указанным до Postpone, сейчас show)
 pagination.onChangePage(el.reloadBanner); // во время асинхронной загрузки новой страницы, перезагрузим баннер
```
После инициализации контейнер получает спец класс **js-adfox**
Если рекламное место продано для него сработает **onBannerLoaded** callback и  контейнеру добавится класс **loaded**.
Более логичное название для callback-a - **onBeforeDraw** (см. JIRA:SSP-434), **onBannerLoaded** - это дань памяти тем временам когда
callback срабатывал после полной загрузки контента в дом и нежелание менять контракт интерфейса, ведь, возможно, логика callback-a снова изменится.
Для того чтобы назначить свой callback можно воспользоваться одним из способов указанных ниже

```javascript
var onBannerLoadedCallback = () => {console.log( `#${el.id} was almost loaded`);}

AdfoxLoader.init(el.id, options.common, options.begun, "show", onBannerLoadedCallback);

// or

el2.onBannerLoaded = () => {console.log( `#${el2.id} was almost loaded`);}

AdfoxLoader.init(el2.id, options2.common, options2.begun);
```

Если вы используете асинхронную версию  carpis.js, и пытаетесь проинициализировать рекламное место до ее готовности, AdfoxLoader отложит вызовы и осуществит их после полной загрузки carpis.js.

#### AdfoxLoader.waitLib()

Возвращает bool, показывает готова ли carpis.js

#### AdfoxLoader.refreshPrKey()

В некоторых случаях чтобы обновить баннеры на новые, без полной перезгрузки страницы нужно использовать этот грязный хак.

#### AdfoxLoader.bannersLoadingQueue

Очередь из вызовов баннеров, в данный момент ожидающая готовности carpis.js


# adfox-loader-spy.js

Spy для adfoxLoader

### Назначение

- Тестирование и аудит рекламных вызовов

### Использование

Если вы используете inline  вставки для вызова баннеров, рекомендуется создать отдельный  bundle для скриптов подключаемых в шапке и подключать его минифицированную версию

 ```javascript
require('./adfox-loader');

// Spy patching of AdfoxLoader for Nightwatch tests
require('./adfox-loader-spy')(AdfoxLoader);
```

Теперь аргументы всех вызовов иницилизции рекламных мест на странице доступны в виде массива

 ```javascript
console.console.log(AdfoxLoader.init.callsLog); // [Array[5], Array[5]]
```

## Заключение

Библиотека capirs.js работает со многими площадками и разными рекламными форматами,
как следствие, она развивается динамично и не всегда предсказуемо.
При работе с этой и другими обертками над capirs.js, общей рекомендацией может служить
документирование кода, с указанием ссылки на тикет в JIRA.
В лихое время эта информация может стать для вас островком твердой почвы.
