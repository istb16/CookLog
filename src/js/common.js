//
// 共通モジュール
//
var CommonModule = function() {
	// 定数（変更禁止）
	this.Version = '0.0';												// バージョン
	this.OtherCode = '@';												// その他コード

	// プロパティ
	this.CookTypes = {};												// タイプ
	this.CookGenrus = {};												// ジャンル
	this.Members = {};												// 提供相手
	this.CookLogs = {};												// 料理履歴

	// public

	//
	// 初期化処理
	//
	this.Init = function() {
		$(document).ready(function() {
			initialDatabase();
		});

		$(document).bind('mobileinit', function() {
			$.mobile.ajaxEnabled = false;
			$.mobile.metaViewportContent = "width=device-width, initial-scale=1";
			$.mobile.selectmenu.prototype.options.nativeMenu = false;
			$.mobile.page.prototype.options.degradeInputs.date = true;
		});
	};

	//
	// データベース（Web Storage）のデータ展開
	//
	this.Refresh = function() {
		// データを展開
		var jsonData = localStorage['CookLogs'];
		if (jsonData) {
			var data = $.evalJSON(jsonData);
			if (data.Version) this.Version = data.Version;
			if (data.CookTypes) this.CookTypes = data.CookTypes;
			if (data.CookGenrus) this.CookGenrus = data.CookGenrus;
			if (data.Members) this.Members = data.Members;
			if (data.CookLogs) this.CookLogs = data.CookLogs;
		}
	};

	//
	// データベース（Web Storage）へのデータ格納
	//
	this.Save = function() {
		var data = {
			'Version' : this.Version,
			'CookTypes' : this.CookTypes,
			'CookGenrus' : this.CookGenrus,
			'Members' : this.Members,
			'CookLogs' : this.CookLogs
		};

		var jsonData = $.toJSON(data);
		localStorage['CookLogs'] = jsonData;
	};

	//
	// Datetimeの文字列変換(yyyy-MM-ddThh:mm)
	//
	this.Datetime2String = function(date) {
		var dy = date.getFullYear();
		var dm = date.getMonth() + 1;
		var dd = date.getDate();
		var th = date.getHours();
		var tm = date.getMinutes();

		var rt = $.format('%04d-%02d-%02dT%02d:%02d', dy, dm, dd, th, tm);
		return rt;
	};

	//
	// コントロールid名からkeyを取得
	//
	this.ConvCtlId2Key = function(ctlId) {
		var pos = ctlId.lastIndexOf('_');
		if (pos < 0) return false;
		return ctlId.substr(pos + 1);
	};

	//
	// HTMLサニタイズ
	//
	this.Sanitize = function(val) {
		return $("<div/>").text(val).html();
	};

	//
	// Queryパラメータの取得
	//
	this.GetQueryParams = function() {
		var params = {};

 		var url = $(location).attr('href');
 		var pos = url.lastIndexOf('?');
 		if (pos < 0) return params;
 		var querys = url.substr(pos + 1);
//		var querys = sessionStorage.QueryParams;

 		return this.SplitQueryParamss(querys);
	};

	//
	// Queryパラメータの取得（URL）
	//
	this.GetQueryParams4Url = function(url) {
		var params = {};

 		var pos = url.lastIndexOf('?');
 		if (pos < 0) return params;
 		var querys = url.substr(pos + 1);

 		return this.SplitQueryParamss(querys);
	};

	//
	// Queryパラメータの分割
	//
	this.SplitQueryParamss = function(querys) {
		var params = {};

		querys = querys.split('&');

		for (var key in querys) {
			var q = querys[key].split('=');
			if (q.length > 0) {
				if (q.length == 1) {
					params[q[0]] = true;
				}
				else {
					params[q[0]] = q[1];
				}
			}
		}
		return params;
	};

	//
	// デバッグ用のブレイクポイント
	// Ajax等で読み込まれるjsファイルのデバッグ用
	//
	this.Debug = function() {
	};

	// private

	//
	// データベース（Web Storage）の初期化処理
	//
	var initialDatabase = function() {
		// 保持しているデータを取得
		var jsonData = localStorage['CookLogs'];
		if (!jsonData) {
			var cookTypes = {0:'主食', 1:'主菜', 2:'副菜', '@':'その他'};
			var cookGenrus = {0:'和食', 1:'洋食', 2:'中華', 3:'イタリアン', 4:'韓国', 5:'アジア', 6:'エスニック', '@':'その他'};
			var members = {};
			var cookLogs = {};
			var data = {
				'Version' : '1.0',
				'CookTypes' : cookTypes,
				'CookGenrus' : cookGenrus,
				'Members' : members,
				'CookLogs' : cookLogs
			};
			jsonData = $.toJSON(data);
			localStorage['CookLogs'] = jsonData;
		}
	};
}

//
// 料理履歴モジュール
//
var CookLogModule = function() {
	// 料理名
	this.Name  = null;
	// 提供日時の取得
	this.Date = null;
	// タイプの取得
	this.Type = null;
	// ジャンルの取得
	this.Genre = null;
	// 提供相手の取得
	this.Members = new Array();
	// メモの取得
	this.Memo = null;
}

var commonModule = new CommonModule();
commonModule.Init();