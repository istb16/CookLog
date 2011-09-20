var PageModule = function() {

	// private変数
	var commonModule;
	if (!commonModule) commonModule = new CommonModule();

	// publicメソッド

	//
	// 初期化処理
	//
	this.Init = function() {
		$(document).ready(function() {
			// 各コントロールの取得
			var fsCookTypes = $('#fsCookTypes');
			var ddlCookGenres = $('#ddlCookGenres');
			var cbMembers = $('#cbMembers');
			var dtCookDate = $('#dtCookDate');

			// 共通データの取得
			commonModule.Refresh();

			// タイプの構築
			if (fsCookTypes) {
				fsCookTypes.children('input').remove();
				fsCookTypes.children('label').remove();
				for (var key in commonModule.CookTypes) {
					var valueKey = "rdCookType_" + key;
					var checked = "";
					if (key == commonModule.OtherCode) {
						checked = "checked='checked' ";
					}
					fsCookTypes.append($.format('<input type="radio" name="rdCookTypes" id="%s" value="%s" %s/>', valueKey, valueKey, checked));
					fsCookTypes.append($.format('<label for="%s">%s</label>', valueKey, commonModule.CookTypes[key]));
				}
			}

			// ジャンルの構築
			if (ddlCookGenres) {
				ddlCookGenres.children().remove();
				for (var key in commonModule.CookGenrus) {
					var selected = "";
					if (key == commonModule.OtherCode) {
						selected = " selected";
					}
					ddlCookGenres.append($.format('<option value="%s"%s>%s</option>', key, selected, commonModule.CookGenrus[key]));
				}
			}

			// 提供相手の構築
			if (cbMembers) {
				cbMembers.children('input').remove();
				cbMembers.children('label').remove();
				ctlInsertBase = cbMembers.children('a');
				for (var key in commonModule.Members) {
					var valueKey = "cbMember_" + key;
					$($.format('<input type="checkbox" name="%s" id="%s" />', valueKey, valueKey)).insertBefore(ctlInsertBase);
					$($.format('<label for="%s">%s</label>', valueKey, commonModule.Members[key])).insertBefore(ctlInsertBase);
				}
			}

			// 提供日時のデフォルト値をセット
			if (dtCookDate) {
				// 現在時刻から直近の設定可能な時刻を算出し、セットする
				var dtNow = new Date();
				var min = dtNow.getMinutes();
				if (min > 30) dtNow.setMinutes(30);
				else dtNow.setMinutes(0);

				dtCookDate.val(commonModule.Datetime2String(dtNow));
			}

			//
			// Submitイベント処理
			//
			$('form').bind('submit', function() {
				if(CookAdd()) {
					// 結果表示
					alert('料理を追加しました。');

					// 履歴に飛ぶ
					$.mobile.changePage('cookLog', 'slide', true);
				}

				return false;
			});
		});
	};

	//
	// 料理の追加
	//
	var CookAdd = function() {
		$.mobile.pageLoading();

		// 共通データの取得
		commonModule.Refresh();

		// 料理名の取得
		var name = $('#txtCookName').val();
		// 提供日時の取得
		var date = $('#dtCookDate').val();
		// タイプの取得
		var type = null;
		var rdCookType = $('#fsCookTypes').find('input[name="rdCookTypes"]:checked');
		if (rdCookType) {
			type = rdCookType.val();
			type = commonModule.ConvCtlId2Key(type);
		}
		// ジャンルの取得
		var genre = null;
		var ddlCookGenre = $('#ddlCookGenres').find(':selected');
		if (ddlCookGenre) genre = ddlCookGenre.val();
		// 提供相手の取得
		var members = new Array();
		var cbMembers = $('#cbMembers').find('input[type="checkbox"]:checked');
		for (var i = 0; i < cbMembers.length; i++) {
			var key = commonModule.ConvCtlId2Key(cbMembers[i].id);
			members.push(key);
		}
		// メモの取得
		var memo = $('#txaCookMemo').val();

		// 項目チェック
		var errorMessage = '';

		if (!name || (name.length <= 0)) {
			errorMessage += '・料理名を入力してください';
		}

		if (!date || (date.length <= 0)) {
			errorMessage += '・提供日時を入力してください';
		}

		if (!type || (type.length <= 0)) {
			errorMessage += '・タイプを選択してください';
		}

		if (!genre || (genre.length <= 0)) {
			errorMessage += '・ジャンル日時を入力してください';
		}

		if (memo) {
			if (memo.length >= 140) {
				errorMessage += '・メモが長いため、Twitter風にしてください';
			}
		}

		// 保存処理
		var isSuccess = false;
		if (errorMessage.length <= 0) {
			// 保存するデータの作成
			var cookLog = new CookLogModule();
			cookLog.Name  = name;
			cookLog.Date = date;
			cookLog.Type = type;
			cookLog.Genre = genre;
			cookLog.Members = members;
			cookLog.Memo = memo;

			// 新規キーを取得
			var maxKey = -1;
			for (var key in commonModule.CookLogs) {
				if (key > maxKey) maxKey = key;
			}
			maxKey++;
			commonModule.CookLogs[maxKey] = cookLog;

			// 保存
			commonModule.Save();

			isSuccess = true;
		}
		else {
			alert(errorMessage);
		}

		$.mobile.pageLoading(true);

		return isSuccess;
	};
}

var pageModule = new PageModule();
pageModule.Init();