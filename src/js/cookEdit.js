var PageModule = function() {

	// private変数
	var commonModule;
	if (!commonModule) commonModule = new CommonModule();

	// publicメソッド

	//
	// 初期化処理
	//
	this.Init = function() {
		//
		// 起動時イベント処理
		//
		$(document).ready(function() {
			// 各コントロールの取得
			var txtCookName = $('#txtCookName');
			var fsCookTypes = $('#fsCookTypes');
			var ddlCookGenres = $('#ddlCookGenres');
			var cbMembers = $('#cbMembers');
			var dtCookDate = $('#dtCookDate');
			var txaCookMemo = $('#txaCookMemo');

			// 共通データの取得
			commonModule.Refresh();

			// 編集する料理データを取得
			var cookLog = null;
			var queryParams = commonModule.GetQueryParams();
			var id = queryParams['id'];
			if (id) {
				$('#hdnId').val(id);
				cookLog = commonModule.CookLogs[id];
			}

			// 料理名の構築
			if (txtCookName) {
				if (cookLog) txtCookName.val(cookLog.Name);
			}

			// 提供日時の構築
			if (dtCookDate) {
				if (cookLog) dtCookDate.val(cookLog.Date);
			}

			// タイプの構築
			if (fsCookTypes) {
				var keyOld = commonModule.OtherCode;
				if (cookLog) keyOld = cookLog.Type;

				fsCookTypes.children('input').remove();
				fsCookTypes.children('label').remove();
				for (var key in commonModule.CookTypes) {
					var valueKey = "rdCookType_" + key;
					var checked = "";
					if (key == keyOld) {
						checked = "checked='checked' ";
					}
					fsCookTypes.append($.format('<input type="radio" name="rdCookTypes" id="%s" value="%s" %s/>', valueKey, valueKey, checked));
					fsCookTypes.append($.format('<label for="%s">%s</label>', valueKey, commonModule.CookTypes[key]));
				}
			}

			// ジャンルの構築
			if (ddlCookGenres) {
				var keyOld = commonModule.OtherCode;
				if (cookLog) keyOld = cookLog.Genre;

				ddlCookGenres.children().remove();
				for (var key in commonModule.CookGenrus) {
					var selected = '';
					if (key == keyOld) {
						selected = ' selected';
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
					var checked = '';
					if (cookLog && (cookLog.Members.indexOf(key) >= 0)) {
						checked = 'checked="checked" ';
					}
					$($.format('<input type="checkbox" name="%s" id="%s" %s/>', valueKey, valueKey, checked)).insertBefore(ctlInsertBase);
					$($.format('<label for="%s">%s</label>', valueKey, commonModule.Members[key])).insertBefore(ctlInsertBase);
				}
			}

			// メモの構築
			if (txaCookMemo) {
				if (cookLog) txaCookMemo.val(cookLog.Memo);
			}

			//
			// Submitイベント処理
			//
			$('form').bind('submit', function() {
				if(CookUpdate()) {
					// 結果表示
					alert('料理を保存しました。');

					// 終了
					location.href = 'cookLog';
				}

				return false;
			});

			//
			// 削除ボタンクリックイベント処理
			//
			$('#btnDelete').bind('click', function() {
				if (confirm('料理を削除してもよろしいですか')) {
					if (CookDelete()) {
						// 終了
						location.href = 'cookLog';
					}
				}

				return false;
			});
		});
	};

	//
	// 料理の更新
	//
	var CookUpdate = function() {
		$.mobile.pageLoading();

		// 共通データの取得
		commonModule.Refresh();

		// 料理IDの取得
		var id = $('#hdnId').val();
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

		if (!id) {
			errorMessage += '・システムエラーが発生しました';
		}

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

			commonModule.CookLogs[id] = cookLog;

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

	//
	// 料理の削除
	//
	var CookDelete = function() {
		$.mobile.pageLoading();

		// 共通データの取得
		commonModule.Refresh();

		// 料理IDの取得
		var id = $('#hdnId').val();

		// 項目チェック
		var errorMessage = '';

		if (!id) {
			errorMessage += '・システムエラーが発生しました';
		}

		// 保存処理
		var isSuccess = false;
		if (errorMessage.length <= 0) {
			// リストから削除
			delete commonModule.CookLogs[id];

			// 保存
			commonModule.Save();

			isSuccess = true;
		}
		else {
			alert(errorMessage);
		}

		$.mobile.pageLoading(true);

		return isSuccess;
	}
}

var pageModule = new PageModule();
pageModule.Init();