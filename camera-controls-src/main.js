baseUrl: "../", paths: {
    "angular-lazy-img": "lib/angular-lazy-img/release/angular-lazy-img",
    angular: "lib/angular/angular",
    "angular-bootstrap": "lib/angular-bootstrap/ui-bootstrap-tpls",
    "angular-sanitize": "lib/angular-sanitize/angular-sanitize",
    "angular-ui-router": "lib/angular-ui-router/release/angular-ui-router",
    "angular-translate": "lib/angular-translate/angular-translate",
    "angular-translate-loader-partial": "lib/angular-translate-loader-partial/angular-translate-loader-partial",
    messageformat: "lib/messageformat/messageformat",
    "angular-translate-interpolation-messageformat": "lib/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat",
    "angular-dynamic-locale": "lib/angular-dynamic-locale/src/tmhDynamicLocale",
    "angular-css-injector": "lib/angular-css-injector/angular-css-injector",
    "requirejs-text": "lib/requirejs-text",
    jquery: "lib/jquery/dist/jquery",
    async: "lib/requirejs-plugins/src/async",
    lodash: "lib/lodash/lodash",
    "net.rfactor2.ui.framework": "framework/app"
    }, shim: {
    "angular-lazy-img": {
        deps: ["angular"]
    },
    angular: {
        exports: "angular",
        deps: ["jquery"]
    },
    "angular-bootstrap": {
        deps: ["angular"]
    },
    "angular-sanitize": {
        deps: ["angular"]
    },
    "angular-ui-router": {
        deps: ["angular"]
    },
    "angular-dynamic-locale": {
        deps: ["angular"]
    },
    "angular-translate": {
        deps: ["angular"]
    },
    "angular-translate-loader-partial": {
        deps: ["angular", "angular-translate"]
    },
    "angular-translate-interpolation-messageformat": {
        deps: ["angular", "angular-translate"]
    },
    lodash: {
        exports: "_"
    },
    "jquery-ui": {
        deps: ["jquery"]
    }
    }
    }), define("watch/main", function() {}),
    
    
    
    
    define("watch/services/WatchService", ["require", "exports"], function(require, exports) {
        var WatchService = function() {
            function WatchService($http) {
                this.$http = $http, this.watchServiceUrl = "/rest/watch/"
            }
            return WatchService.prototype.getReplays = function() {
                var replays = [{
                    track: "Michigan",
                    car: "Stock Car Resurrection",
                    size: "37917 KB",
                    datetime: "2016-12-12 11:37"
                }, {
                    track: "Michigan",
                    car: "Stock Car Resurrection",
                    size: "37917 KB",
                    datetime: "2016-12-12 11:37"
                }, {
                    track: "Michigan",
                    car: "Stock Car Resurrection",
                    size: "37917 KB",
                    datetime: "2016-12-12 11:37"
                }, {
                    track: "Michigan",
                    car: "Stock Car Resurrection",
                    size: "37917 KB",
                    datetime: "2016-12-12 11:37"
                }, {
                    track: "Michigan",
                    car: "Stock Car Resurrection",
                    size: "37917 KB",
                    datetime: "2016-12-12 11:37"
                }, {
                    track: "Michigan",
                    car: "Stock Car Resurrection",
                    size: "37917 KB",
                    datetime: "2016-12-12 11:37"
                }, {
                    track: "Aida",
                    car: "Renault Clip Cup",
                    size: "3972 KB",
                    datetime: "2017-04-17 14:26"
                }, {
                    track: "Adelaide",
                    car: "Renault Clip Cup",
                    size: "6136 KB",
                    datetime: "2017-04-17 21:26"
                }, {
                    track: "Barcelona",
                    car: "Renault Clip Cup",
                    size: "125014 KB",
                    datetime: "2017-03-01 00:59"
                }, {
                    track: "Sebring",
                    car: "Corvette C6.r ZR1",
                    size: "34 KB",
                    datetime: "2017-04-21 18:46"
                }];
                return _.forEach(replays, function(replay, index) {
                    replay.id = (index + 1).toString(), replay.trackImage = "/rest/race/track/532226134a25cd2d12debf7b641e8e1bdcebcfe6/image", replay.trackThumb = "/rest/race/track/532226134a25cd2d12debf7b641e8e1bdcebcfe6/thumbnail", replay.drivers = _.fill(Array(_.random(1, 20)), "Rodger Ward"), replay.noOfDrivers = replay.drivers.length
                }), replays
            }, WatchService.prototype.watchReplay = function(id) {
                return console.log("watch replay:", id), this.$http.post(this.watchServiceUrl + "replay", id).then(function(response) {
                    return response.data
                })
            }, WatchService.prototype.renameReplay = function(id) {
                return console.log("rename replay:", id), this.$http.post(this.watchServiceUrl + "replay/rename", id).then(function(response) {
                    return response.data
                })
            }, WatchService.prototype.deleteReplay = function(id) {
                return console.log("delete replay:", id), this.$http.delete(this.watchServiceUrl + "replay", id).then(function(response) {
                    return response.data
                })
            }, WatchService
        }();
        return WatchService.$inject = ["$http", "stateService"], WatchService
    }), define("watch/controllers/WatchCtrl", ["require", "exports"], function(require, exports) {
        var WatchCtrl = function() {
            function WatchCtrl(watchService, $translate, $state, latestReplays) {
                this.watchService = watchService, this.$translate = $translate, this.$state = $state, this.latestReplays = latestReplays;
                var i18n = {
                    translate: function(s) {
                        return s
                    }
                };
                this.tabs = [i18n.translate("REPLAYS"), i18n.translate("BROADCASTS"), i18n.translate("LIVETIMING")]
            }
            return WatchCtrl.prototype.en = function() {
                this.$translate.use("en_US")
            }, WatchCtrl.prototype.nl = function() {
                this.$translate.use("nl_NL")
            }, WatchCtrl.prototype.goToReplays = function() {
                this.$state.go("replays")
            }, WatchCtrl.prototype.watchReplay = function(id) {
                this.watchService.watchReplay(id)
            }, WatchCtrl
        }();
        return WatchCtrl.$inject = ["watchService", "$translate", "$state", "latestReplays"], WatchCtrl.resolve = {
            latestReplays: function(watchService) {
                return _.take(_.orderBy(watchService.getReplays(), "datetime", "desc"), 5)
            }
        }, WatchCtrl
    }), define("watch/controllers/CameraCtrl", ["require", "exports"], function(require, exports) {
        var CameraCtrl = function() {
            function CameraCtrl($http, $interval) {
                var _this = this;
                this.$http = $http, this.$interval = $interval, this.selectCamera = function() {
                    _this.$http.put(_this.baseUrl + "focus/" + _this.selectedCamera + "/" + _this.selectedCameraGroup + "/" + _this.selectedShouldAdvance)
                }, this.selectCar = function(slotID) {
                    _this.$http.put(_this.baseUrl + "focus/" + slotID)
                }, this.selectCarAndCamera = function(slotID, camera) {
                    _this.selectCar(slotID), _this.selectedCamera = camera, _this.selectCamera()
                }, this.selectPreviousCar = function() {
                    _this.$http.put(_this.baseUrl + "focusBackward")
                }, this.selectNextCar = function() {
                    _this.$http.put(_this.baseUrl + "focusForward")
                }, this.jumpToTime = function(event) {
                    (!event || event && 13 === event.keyCode) && _this.$http.put(_this.baseUrl + "replayTime/" + _this.jumpTime)
                }, this.replayCommand = function(command) {
                    _this.$http.put(_this.baseUrl + "replayCommand/" + command)
                }, this.baseUrl = "/rest/watch/", this.selectedCamera = "SCV_TV_COCKPIT", this.selectedCameraGroup = "GROUP1", this.selectedShouldAdvance = "true", this.cameras = ["SCV_TV_COCKPIT", "SCV_COCKPIT", "SCV_NOSECAM", "SCV_SWINGMAN", "SCV_TRACKSIDE", "SCV_ONBOARD000"], this.trackSideGroups = ["GROUP1", "GROUP2", "GROUP3", "GROUP4"], this.jumpTime = 0, this.cars = [], this.$http.get(this.baseUrl + "standings").then(function(response) {
                    _this.cars = _.sortBy(response.data, "position")
                }), $interval(function() {
                    _this.$http.get(_this.baseUrl + "standings").then(function(response) {
                        _this.cars = _.sortBy(response.data, "position")
                    })
                }, 3e3)
            }
            return CameraCtrl
        }();
        return CameraCtrl.$inject = ["$http", "$interval"], CameraCtrl
    }), define("watch/controllers/OverlayCtrl", ["require", "exports"], function(require, exports) {
        var OverlayCtrl = function() {
            function OverlayCtrl($interval, $http) {
                var _this = this;
                this.$interval = $interval, this.$http = $http, this.standings = [], this.displaySessionName = function() {
                    if (_this.sessionInfo) return _this.sessionInfo.session.replace(/\d/g, "")
                }, this.getFocusDriver = function() {
                    return _.find(_this.standings, function(entry) {
                        return !0 === entry.focus
                    })
                }, this.displayGap = function(entry) {
                    if (!_.includes(_this.sessionInfo.session, "RACE")) return entry.bestLapTime <= 0 ? "-" : _this.formatLapTime(entry.bestLapTime);
                    return 1 == entry.position ? "lap " + (entry.lapsCompleted + 1) : 0 == entry.lapsBehindLeader ? "+" + entry.timeBehindLeader.toFixed(3) : "+" + entry.lapsBehindLeader + " L"
                }, this.secToString = function(value, n) {
                    if (void 0 === n && (n = 0), value <= 0) return "---";
                    var pad = function(n, width, z) {
                            return void 0 === z && (z = "0"), z = z || "0", n += "", n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
                        },
                        hours = Math.floor(value / 3600),
                        minutes = Math.floor((value - 3600 * hours) / 60),
                        seconds = value - 3600 * hours - 60 * minutes,
                        time = "";
                    if (0 != hours ? (time += hours + ":", time += pad(minutes, 2) + ":") : time += 0 != minutes ? minutes + ":" : "", time += value > 60 ? pad(seconds.toString().split(".")[0], 2) : seconds.toString().split(".")[0], n > 0) {
                        n = n > 3 ? 3 : n;
                        var ms = "";
                        if (-1 != seconds.toString().indexOf(".")) {
                            if (ms = seconds.toString().split(".")[1].slice(0, n), ms.length < n)
                                for (var i = 0; i < n - ms.length; i++) ms += "0"
                        } else ms = pad(0, 3);
                        time += "." + ms
                    }
                    return time = "0" == time ? "---" : time, time = "1:0" === time ? "1:00" : time
                }, this.formatLapTime = function(lapTimeInSeconds) {
                    if (lapTimeInSeconds <= 0) return "-";
                    var laptimeInMillis = Math.round(1e3 * lapTimeInSeconds),
                        millis = laptimeInMillis % 1e3,
                        seconds = (laptimeInMillis - millis) / 1e3 % 60;
                    return Math.floor((laptimeInMillis - millis) / 6e4) + ":" + ("00" + seconds).substr(-2, 2) + "." + ("000" + millis).substr(-3, 3)
                }, this.baseUrl = "/rest/watch/", $("body").addClass("overlay"), this.$http.get(this.baseUrl + "standings").then(function(response) {
                    _this.standings = _.sortBy(response.data, "position")
                }), this.$http.get(this.baseUrl + "sessionInfo").then(function(response) {
                    _this.sessionInfo = response.data
                }), this.$interval(function() {
                    _this.$http.get(_this.baseUrl + "standings").then(function(response) {
                        _this.standings = _.sortBy(response.data, "position")
                    }), _this.$http.get(_this.baseUrl + "sessionInfo").then(function(response) {
                        _this.sessionInfo = response.data
                    })
                }, 1e3)
            }
            return OverlayCtrl
        }();
        return OverlayCtrl.$inject = ["$interval", "$http"], OverlayCtrl
    }), define("watch/controllers/ReplaySelectCtrl", ["require", "exports"], function(require, exports) {
        var ReplaySelectCtrl = function() {
            function ReplaySelectCtrl(watchService, replays, $scope) {
                var _this = this;
                this.watchService = watchService, this.replays = replays, this.$scope = $scope;
                var i18n = {
                        translate: function(s) {
                            return s
                        }
                    },
                    jumpMenuConfig = {
                        fixedLabel: i18n.translate("Replays")
                    };
                this.listViewConfiguration = {
                    section: "replays",
                    items: replays,
                    selectedItem: this.replays[0],
                    title: "track",
                    subTitle: "car",
                    subLeft: "datetime",
                    subRight: "size",
                    image: "trackImage",
                    thumbnail: "trackThumb",
                    description: "drivers",
                    showAlphabet: !1,
                    back: "watchPage",
                    theme: "dark",
                    jumpMenuConfig: jumpMenuConfig,
                    breadcrumbsConfig: jumpMenuConfig
                }, $scope.$on("WATCH_REPLAY", function(event, id) {
                    _this.watchService.watchReplay(id)
                }), $scope.$on("RENAME_REPLAY", function(event, id) {
                    _this.watchService.renameReplay(id)
                }), $scope.$on("DELETE_REPLAY", function(event, id) {
                    _this.watchService.deleteReplay(id)
                })
            }
            return ReplaySelectCtrl
        }();
        return ReplaySelectCtrl.$inject = ["watchService", "replays", "$scope"], ReplaySelectCtrl.resolve = {
            replays: function(watchService) {
                return _.orderBy(watchService.getReplays(), "datetime", "desc")
            }
        }, ReplaySelectCtrl
    }), define("watch/watchTemplates", ["angular"], function(angular) {
        return angular.module("watchTemplates", []).run(["$templateCache", function($templateCache) {
            $templateCache.put("watch/index.html", '<!doctype html>\n\n<html>\n<head>\n    <meta charset="utf-8">\n    <script src="../lib/requirejs/require.js"><\/script>\n    <script src="main-8ecae5f794.js"><\/script>\n\n    <link rel="stylesheet" href="../framework/styles/framework.css">\n    <link rel="stylesheet" href="styles/cameras.css">\n    <link rel="stylesheet" href="styles/overlay.css">\n    <link rel="stylesheet" href="styles/watch.css">\n    <script>\n        require([\'watch/app\']);\n    <\/script>\n    <title>rFactor2</title>\n</head>\n\n<body>\n  <ui-view> </ui-view>\n</body>\n</html>\n'), $templateCache.put("watch/partials/cameras.html", '<div class="cameras container">\n    <section class="left">\n        <table>\n            <tr ng-repeat="car in cameraCtrl.cars">\n                <td ng-bind="car.position"></td>\n                <td ng-attr-title="{{ \'Switch to \' + car.driverName + \'\\\'s car\' }}" ng-bind="car.driverName" ng-click="cameraCtrl.selectCar(car.slotID)"></td>\n                <td>\n                    <button ng-repeat="camera in cameraCtrl.cameras"\n                            ng-click="cameraCtrl.selectCarAndCamera(car.slotID, camera)"\n                            ng-attr-title="{{ \'Switch to \' + car.driverName + \'\\\'s \' + camera }}"\n                    >\n                        <span ng-bind="camera"></span>\n                    </button>\n                </td>\n            </tr>\n        </table>\n    </section>\n    <section class="right">\n        <div>\n            <select title="Camera" ng-model="cameraCtrl.selectedCamera"\n                    ng-options="camera for camera in cameraCtrl.cameras"\n            >\n            </select>\n            <select title="Trackside Camera Group" ng-model="cameraCtrl.selectedCameraGroup"\n                    ng-options="group for group in cameraCtrl.trackSideGroups"\n            >\n            </select>\n            <select title="Should Advance" ng-model="cameraCtrl.selectedShouldAdvance">\n                <option value="true">true</option>\n                <option value="false">false</option>\n            </select>\n            <button ng-click="cameraCtrl.selectCamera()">\n                <span>Select camera</span>\n            </button>\n        </div>\n        <div>\n            <button ng-click="cameraCtrl.selectPreviousCar()" title="Switch to previous car">\n                <span>Previous car</span>\n            </button>\n            <button ng-click="cameraCtrl.selectNextCar()" title="Switch to next car">\n                <span>Next car</span>\n            </button>\n        </div>\n        <div>\n            <input type="number" ng-model="cameraCtrl.jumpTime" ng-keyup="cameraCtrl.jumpToTime($event)">\n            <button ng-click="cameraCtrl.jumpToTime()" ng-attr-title="{{ \'Jump to \' + cameraCtrl.jumpTime + \' seconds\'}}">\n                <span>Jump to time</span>\n            </button>\n        </div>\n        <div class="replay-controls">\n            <i class="fa fa-step-backward" title="Go to Beginning" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_BEGIN\')"></i>\n            <i class="fa fa-fast-backward" title="Fast Backwards" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_REVERSESCANFAST\')"></i>\n            <i class="fa fa-backward" title="Backward" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_REVERSESCAN\')"></i>\n            <i class="fa fa-play backwards" title="Play backwards" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_PLAYBACKWARDS\')"></i>\n            <i class="fa fa-chevron-left" title="Slow motion backwards" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_SLOWBACKWARDS\')"></i>\n            <i class="fa fa-stop" title="Stop" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_STOP\')"></i>\n            <i class="fa fa-chevron-right" title="Slow motion" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_SLOW\')"></i>\n            <i class="fa fa-play" title="Play" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_PLAY\')"></i>\n            <i class="fa fa-forward" title="Forward" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_FORWARDSCAN\')"></i>\n            <i class="fa fa-fast-forward" title="Fast Forward" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_FORWARDSCANFAST\')"></i>\n            <i class="fa fa-step-forward" title="Go to End" aria-hidden="true" ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_END\')"></i>\n        </div>\n        <div class="bookmarks">\n            <h3>Bookmarks:</h3>\n            <button ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_SAVEBOOKMARKS\')">\n                <span>Save</span>\n            </button>\n            <button ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_PREVBOOKMARK\')">\n                <span>Prev</span>\n            </button>\n            <button ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_NEXTBOOKMARK\')">\n                <span>Next</span>\n            </button>\n            <br>\n            <button ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_DROPBOOKMARK\')">\n                <span>Drop</span>\n            </button>\n            <button ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_REMOVEBOOKMARK\')">\n                <span>Remove</span>\n            </button>\n            <button ng-click="cameraCtrl.replayCommand(\'VCRCOMMAND_REMOVEALLBOOKMARKS\')">\n                <span>Remove all</span>\n            </button>\n        </div>\n    </section>\n</div>\n'), $templateCache.put("watch/partials/overlay.driver.html", '<div class="focus-driver">\n    <span ng-bind="overlayCtrl.getFocusDriver().position"></span>\n    <span ng-bind="overlayCtrl.getFocusDriver().driverName"></span>\n</div>\n'), $templateCache.put("watch/partials/overlay.html", '<div class="race-info">\n    <span ng-bind="overlayCtrl.displaySessionName()"></span>\n    <span ng-bind="overlayCtrl.secToString(overlayCtrl.sessionInfo.endEventTime - overlayCtrl.sessionInfo.currentEventTime)"></span>\n</div>\n\n<div class="standings">\n    <ul>\n        <li ng-repeat="entry in overlayCtrl.standings">\n            <span ng-bind="entry.position"></span>\n            <span ng-bind="entry.driverName"></span>\n            <span ng-bind="overlayCtrl.displayGap(entry)"></span>\n        </li>\n    </ul>\n</div>\n'), $templateCache.put("watch/partials/panel.replays.html", '<h1 ng-bind="\'Replays\' | translate"></h1>\n<p class="panel-description" ng-bind="\'Recorded races\' | translate"></p>\n<h4 ng-bind="\'Latest activity\' | translate"></h4>\n\n<ul class="no-styling dark">\n    <li ng-repeat="replay in watchCtrl.latestReplays" ng-click="watchCtrl.watchReplay(replay.id)">\n        <div class="image">\n            <img ng-src="{{ ::replay.trackThumb }}" alt="{{ replay.track }}">\n        </div>\n        <div class="text">\n            <h5 ng-bind="replay.track"></h5>\n            <p>\n                <span ng-bind="replay.size"></span>\n                -\n                <span ng-bind="replay.car + \', \'"></span>\n                <span ng-bind="replay.datetime"></span>\n                <span class="fa fa-caret-right"></span>\n            </p>\n            <p ng-pluralize count="replay.noOfDrivers" when="{\'1\': \'{{ replay.noOfDrivers }} driver\', \'other\': \'{{ replay.noOfDrivers }} drivers\' }"></p>\n        </div>\n    </li>\n</ul>\n\n<button class="primary" ng-click="watchCtrl.goToReplays()">\n    <span ng-bind="\'more\' | translate"></span>\n</button>\n'), $templateCache.put("watch/partials/replays.html", '<div class="templ-listview1 replay-selection">\n    <list-view config="replaySelectCtrl.listViewConfiguration"></list-view>\n</div>\n'), $templateCache.put("watch/partials/watch.html", '<top-bar selected="\'watch\'"></top-bar>\n\n<div class="templ-panels">\n\n\t<main class="largepanels" id="large-panels" horiz-scroll>\n\t\t<large-panel chapter="\'REPLAYS\'" panel-layout="\'list\'">\n            <div ng-include="\'partials/panel.replays.html\'"></div>\n\t\t</large-panel>\n\t\t<large-panel chapter="\'BROADCASTS\'">\n\t\t\t<h1 ng-bind="\'Broadcasts\' | translate"></h1>\n\t\t</large-panel>\n\t\t<large-panel chapter="\'LIVETIMING\'">\n\t\t\t<h1 ng-bind="\'Live timing\' | translate"></h1>\n\t\t</large-panel>\n\t\t\x3c!--<large-panel chapter="\'CHAT\'">--\x3e\n\t\t\t\x3c!--<h1 ng-bind="\'Chat\' | translate"></h1>--\x3e\n\t\t\x3c!--</large-panel>--\x3e\n\t</main>\n\t<tab-navigation tabs="watchCtrl.tabs"></tab-navigation>\n\n</div>')
        }])
    }), define("watch/app", ["require", "exports", "./services/WatchService", "./controllers/WatchCtrl", "./controllers/CameraCtrl", "./controllers/OverlayCtrl", "./controllers/ReplaySelectCtrl", "angular", "angular-ui-router", "net.rfactor2.ui.framework", "./watchTemplates", "angular"], function(require, exports, WatchService, WatchCtrl, CameraCtrl, OverlayCtrl, ReplaySelectCtrl) {
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var ngModule = angular.module("watchPage", ["ui.router", "pascalprecht.translate", "watchTemplates"]);
        ngModule.config(["$urlRouterProvider", "$stateProvider", "$translatePartialLoaderProvider", function($urlRouterProvider, $stateProvider, $translatePartialLoaderProvider) {
            $urlRouterProvider.otherwise(function($injector) {
                return $injector.get("$state").go("watchPage")
            }), $translatePartialLoaderProvider.addPart("watch"), $stateProvider.state("watchPage", {
                url: "/watch",
                resolve: WatchCtrl.resolve,
                controller: "WatchCtrl as watchCtrl",
                templateUrl: "watch/partials/watch.html"
            }).state("cameras", {
                url: "/cameras",
                controller: "CameraCtrl as cameraCtrl",
                templateUrl: "watch/partials/cameras.html"
            }).state("overlay", {
                url: "/overlay",
                controller: "OverlayCtrl as overlayCtrl",
                templateUrl: "watch/partials/overlay.html"
            }).state("overlayDriver", {
                url: "/overlay-driver",
                controller: "OverlayCtrl as overlayCtrl",
                templateUrl: "watch/partials/overlay.driver.html"
            }).state("replays", {
                url: "/replays",
                resolve: ReplaySelectCtrl.resolve,
                controller: "ReplaySelectCtrl as replaySelectCtrl",
                templateUrl: "watch/partials/replays.html"
            })
        }]), ngModule.service("watchService", WatchService), ngModule.controller("WatchCtrl", WatchCtrl), ngModule.controller("CameraCtrl", CameraCtrl), ngModule.controller("OverlayCtrl", OverlayCtrl), ngModule.controller("ReplaySelectCtrl", ReplaySelectCtrl), angular.bootstrap(document, ["watchPage", "net.rfactor2.ui.framework"])
    });