"use strict";
const getRandomDate = () =>
{
	// 引数を取り出し
	let y1 = 2000;
	let m1 = 1;
	let da1 = 1;
	let y2 = 2010;
	let m2 = 12;
	let da2 = 31;

	// うるう年などを考慮した，矛盾のない日付オブジェクトを生成
	let d1 = new Date( y1, m1, da1 );
	let d2 = new Date( y2, m2, da2 );

	// 差分をミリ秒で求める
	let diff_ms = d2 - d1;
	//alert( "オリジナルの差分は" + diff_ms + "ミリ秒" );

	// 差分を0〜100％の割合でランダムに加工する
	let diff_ms_random = Math.random() * diff_ms;
	//alert( "加工された差分は" + diff_ms_random + "ミリ秒" );

	// 基準日時に対してランダムな差分を加算し，新たな日付オブジェクトとする
	let d_random = new Date();
	d_random.setTime( d1.getTime() + diff_ms_random );

	// ランダムな日付として返却する
	return "new Date(\"" + d_random.toUTCString() + "\")";
};

const attendanceCreate = () => {
	const teachers = {
		takahashi:[
			"a29711b6-aec1-4007-b695-e87fb973360a",
			"3de45556-925c-47fa-ad7b-82ce0dac04dc"

		],
		guriko:[
			"572291de-00b5-4455-ac48-82e218604017",
			"3f0713de-8070-43b1-a4fa-aa6edd0bde6b",
		]
	};
	const students = {
		takahashi: [
			"d5162515-7ed3-48d7-b4de-046f13552ce4",
			"e7d3f661-661b-4e57-ad56-7d002e8be43f",
			"6446e971-715f-42eb-a8e2-879635c42ffe",
			"e1e249b0-2485-424d-8418-eaa9a222bcd2"
		],
		guriko: [
			"e2065376-f95a-4cb4-aa9f-793a8eb8f359",
			"d7086629-7c6a-4b97-9fe3-0a1aac51cd46",
			"bc332213-fcea-4ae5-97fe-4bb4f911c1d0",
			"bcbdc394-f8ab-42ab-b4b6-e88a9a369cd0"
		]

	};
	const conditions = ["good","subtle","bad"];
	const details = ["あ","か","さ","た","な","は"];
	let array = [];

	for (let teacher in teachers) {
		for (let i = 0; i < 20 ; i++) {
			array.push(
				{
					attendanceId: "",
					time: getRandomDate(),
					condition:  conditions[Math.floor(Math.random() * conditions.length)],
					detail: details[Math.floor(Math.random() * details.length)],
					studentId: students[teacher][Math.floor(Math.random() * students[teacher].length)],
					teacherId: teachers[teacher][Math.floor(Math.random() * teachers[teacher].length)]
				}
			);
		}
	}
	console.table(array);
};
attendanceCreate();