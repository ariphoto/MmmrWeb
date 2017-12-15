'use strict';
const hasher = require('../utils/hasher');

// const destroyAll = (model,func) => {
// 	model.destroy({
// 		where: {},
// 		truncate: true
// 	}).then(func);
// };
const salt = 'shio';
const takahashi = {
	schoolId:'takahashi',
	mailAddress:"takahashi@hoiku.en.jp",
	name:"たかはし保育園",
	password:hasher('takahashi',salt),
	salt:salt
};
const guriko = {
	schoolId:'guriko',
	mailAddress:"guriko@hoiku.en.jp",
	name:"ぐりこ幼稚園",
	password:hasher('guriko',salt),
	salt:salt
};  
const schoolCreate = (model) => {
	model.bulkCreate([
		takahashi,
		guriko
	],{
		updateOnDuplicate:true
	});
};
const teacherCreate = (model) => {
	model.bulkCreate([
		{
			teacherId: "a29711b6-aec1-4007-b695-e87fb973360a",
			name: "鶴田 貴浩",
			password: hasher("tsuruta", salt),
			salt: salt,
			schoolId: takahashi.schoolId,
			remarks: "tsuru"
		}, {
			teacherId: "f032a9fa-5591-4429-afff-69fea70c1588",
			name: "村上 正宣",
			password: hasher("murakami", salt),
			salt: salt,
			schoolId: guriko.schoolId,
            remarks: "mura"
		}, {
			teacherId: "e9f5ef2b-e082-4a05-9526-f773f4e1b888",
			name: "白石 右京",
			password: hasher("shiraishi", salt),
			salt: salt,
			schoolId: takahashi.schoolId,
            remarks: "shira"
		}, {
			teacherId: "7db42d9c-e661-4071-8b77-282ab132b671",
			name: "平井 玲一",
			password: hasher("hirai", salt),
			salt: salt,
			schoolId: guriko.schoolId,
            remarks: "hira"
		}, {
			teacherId: "7e0060bf-b2f0-4169-aa8d-36e071bdc224",
			name: "村上 正宣",
			password: hasher("murakami", salt),
			salt: salt,
			schoolId: takahashi.schoolId,
            remarks: "mura"
		}, {
			teacherId: "fe012f42-b3a0-43f3-9499-dcf59cd1ddf7",
			name: "望月 正次",
			password: hasher("mochiduki", salt),
			salt: salt,
			schoolId: guriko.schoolId,
            remarks: "mochi"
		}, {
			teacherId: "5f515b55-2389-4b4a-b050-e6950f15b9ad",
			name: "中井 政広",
			password: hasher("nakai", salt),
			salt: salt,
			schoolId: takahashi.schoolId,
            remarks: "naka"
		}, {
			teacherId: "572291de-00b5-4455-ac48-82e218604017",
			name: "大平 忠和",
			password: hasher("ohira", salt),
			salt: salt,
			schoolId: guriko.schoolId,
            remarks: "oo"
		}, {
			teacherId: "3de45556-925c-47fa-ad7b-82ce0dac04dc",
			name: "米田 一世",
			password: hasher("yoneda", salt),
			salt: salt,
			schoolId: takahashi.schoolId,
            remarks: "yone"
		}, {
			teacherId: "3f0713de-8070-43b1-a4fa-aa6edd0bde6b",
			name: "横井 留三",
			password: hasher("yokoi", salt),
			salt: salt,
			schoolId: guriko.schoolId,
            remarks: "yoko"
		}
	],{
		updateOnDuplicate:true
	});
};

const bara = {
	partyId: '99898d8f-1a0f-4d12-bff7-c1bdad402d6b',
	name: "ばら",
	schoolId: takahashi.schoolId,
    remarks: "ba"
}; 

const fuji = {
	partyId: 'f53a2baa-a22e-4d92-8e88-877c2df1096b',
	name: "ふじ",
	schoolId: takahashi.schoolId,
    remarks: "fu"
};
const tampopo = {
	partyId: '355db0d4-cdc5-4c5e-9012-95c680161c9f',
	name: "たんぽぽ",
	schoolId: guriko.schoolId,
    remarks: "ta"
};
const sumire = {
	partyId: '22f70121-d40e-4934-bf21-9dad567309d9',
	name: "すみれ",
	schoolId: guriko.schoolId,
    remarks: "su"
};

const partyCreate = (model) => {
	model.bulkCreate([
		bara,
		fuji,
		tampopo,
		sumire
	],{
		updateOnDuplicate:true
	});
};
const studentCreate = (model) => {
	model.bulkCreate([
		{
			studentId: "d5162515-7ed3-48d7-b4de-046f13552ce4",
			name: "北島 有紀子",
			nickname: "ゆき",
			phonetic: "きたじまゆきこ",
			gender: "woman",
			picturePath: "y_kitajima.jpg",
			birthDay: Date.UTC(2012, 4, 5),
			partyId: bara.partyId
		}, {
			studentId: "e7d3f661-661b-4e57-ad56-7d002e8be43f",
			name: "星 美伸",
			nickname: "みのぶ",
			phonetic: "ほしみのぶ",
			gender: "man",
			picturePath: "m_hoshi.jpg",
			birthDay: Date.UTC(2012, 6, 7),
			partyId: bara.partyId
		}, {
			studentId: "12d7589d-2a79-4899-974e-b7c725655bf5",
			name: "角田 祥三",
			nickname: "しょう",
			phonetic: "かくたしょうぞう",
			gender: "man",
			picturePath: "s_kakuta.jpg",
			birthDay: Date.UTC(2012, 8, 20),
			partyId: bara.partyId
		}, {
			studentId: "6446e971-715f-42eb-a8e2-879635c42ffe",
			name: "高山 登喜雄",
			nickname: "ときお",
			phonetic: "たかやまときお",
			gender: "man",
			picturePath: "t_takayama.jpg",
			birthDay: Date.UTC(2012, 9, 17),
			partyId: bara.partyId
		}, {
			studentId: "fe087cc4-b68f-4329-a689-aec885fcd1f6",
			name: "野沢 佳久",
			nickname: "よし",
			phonetic: "のざわよしひさ",
			gender: "man",
			picturePath: "y_nozawa.jpg",
			birthDay: Date.UTC(2012, 3, 5),
			partyId: bara.partyId
		}, {
			studentId: "a1036336-fe4a-4958-bca1-4eece2d25dc9",
			name: "黒木 千絵子",
			nickname: "ちえ",
			phonetic: "くろきちえこ",
			gender: "woman",
			picturePath: "c_kuroki.jpg",
			birthDay: Date.UTC(2012, 1, 23),
			partyId: bara.partyId
		}, {
			studentId: "15b44e6c-f722-4949-be69-8c26da20dc9a",
			name: "根本 境二",
			nickname: "きょう",
			phonetic: "ねもときょうじ",
			gender: "man",
			picturePath: "k_nemoto.jpg",
			birthDay: Date.UTC(2012, 7, 5),
			partyId: bara.partyId
		}, {
			studentId: "e1e249b0-2485-424d-8418-eaa9a222bcd2",
			name: "下村 寿彦",
			nickname: "とし",
			phonetic: "しもむらとしひこ",
			gender: "man",
			picturePath: "t_shimomura.jpg",
			birthDay: Date.UTC(2015, 10, 20),
			partyId: fuji.partyId
		}, {
			studentId: "e2065376-f95a-4cb4-aa9f-793a8eb8f359",
			name: "奥村 久江",
			nickname: "ひさ",
			phonetic: "おくむらひさえ",
			gender: "woman",
			picturePath: "h_okumura.jpg",
			birthDay: Date.UTC(2013, 11, 6),
			partyId: tampopo.partyId
		}, {
			studentId: "e536b799-6ac1-4563-b40d-8c8244617078",
			name: "荻野 つばさ",
			nickname: "つばさ",
			phonetic: "おぎのつばさ",
			gender: "man",
			picturePath: "t_ogino.jpg",
			birthDay: Date.UTC(2013, 8, 3),
			partyId: tampopo.partyId
		}, {
			studentId: "d7086629-7c6a-4b97-9fe3-0a1aac51cd46",
			name: "比嘉 有子",
			nickname: "ゆう",
			phonetic: "ひがゆうこ",
			gender: "woman",
			picturePath: "y_higa.jpg",
			birthDay: Date.UTC(2014, 3, 27),
			partyId: sumire.partyId
		}, {
			studentId: "bc332213-fcea-4ae5-97fe-4bb4f911c1d0",
			name: "福井 智勝",
			nickname: "とも",
			phonetic: "ふくいともかつ",
			gender: "man",
			picturePath: "t_hukui.jpg",
			birthDay: Date.UTC(2014, 2, 15),
			partyId: sumire.partyId

		}, {
			studentId: "bcbdc394-f8ab-42ab-b4b6-e88a9a369cd0",
			name: "松岡 泰秀",
			nickname: "やす",
			phonetic: "まつおかやすひで",
			gender: "man",
			picturePath: "y_matsuoka.jpg",
			birthDay: Date.UTC(2014, 8, 1),
			partyId: sumire.partyId
		}
	],{
		updateOnDuplicate:true
	});
};

const attendanceCreate = (model) => {
	model.bulkCreate([
		{attendanceId:"e5ada369-dfa1-4ac0-84fb-ebbebd8834a0",
			time:new Date(new Date("2003-01-18T21:08:10.662Z").toUTCString().replace(" GMT","") ),
			condition:"subtle",
			detail:"か",
			studentId:"d5162515-7ed3-48d7-b4de-046f13552ce4",
			teacherId:"3de45556-925c-47fa-ad7b-82ce0dac04dc"},

		{attendanceId:"4c655b7e-33d6-49dd-b911-d76294193465",
			time:new Date(new Date("2001-12-12T02:18:32.950Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"た",
			studentId:"e1e249b0-2485-424d-8418-eaa9a222bcd2",
			teacherId:"3de45556-925c-47fa-ad7b-82ce0dac04dc"},

		{attendanceId:"ef3f7947-e574-445a-be46-7b201da197cf",
			time:new Date(new Date("2006-09-08T07:04:12.820Z").toUTCString().replace(" GMT","") ),
			condition:"good",
			detail:"は",
			studentId:"6446e971-715f-42eb-a8e2-879635c42ffe",
			teacherId:"3de45556-925c-47fa-ad7b-82ce0dac04dc"},

		{attendanceId:"7a2228b6-7e43-4d5a-9137-c3baa9cd8829",
			time:new Date(new Date("2006-08-01T14:37:29.426Z").toUTCString().replace(" GMT","") ),
			condition:"subtle",
			detail:"か",
			studentId:"d5162515-7ed3-48d7-b4de-046f13552ce4",
			teacherId:"3de45556-925c-47fa-ad7b-82ce0dac04dc"},

		{attendanceId:"6cf53c56-a8e1-4f26-84b5-fbabaa954848",
			time:new Date(new Date("2010-06-17T20:05:06.697Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"あ",
			studentId:"d5162515-7ed3-48d7-b4de-046f13552ce4",
			teacherId:"a29711b6-aec1-4007-b695-e87fb973360a"},

		{attendanceId:"e611d1b7-26cc-414f-b56f-4c1e1086d0e5",
			time:new Date(new Date("2006-12-09T22:09:10.994Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"あ",
			studentId:"6446e971-715f-42eb-a8e2-879635c42ffe",
			teacherId:"3de45556-925c-47fa-ad7b-82ce0dac04dc"},

		{attendanceId:"f9e53082-3bcd-4e95-ad4d-2f01d8b6ccee",
			time:new Date(new Date("2002-10-31T05:17:25.552Z").toUTCString().replace(" GMT","") ),
			condition:"good",
			detail:"あ",
			studentId:"e1e249b0-2485-424d-8418-eaa9a222bcd2",
			teacherId:"a29711b6-aec1-4007-b695-e87fb973360a"},

		{attendanceId:"a4481dac-50ea-43c2-afe3-28b7c13b3ef0",
			time:new Date(new Date("2010-04-02T19:25:10.968Z").toUTCString().replace(" GMT","") ),
			condition:"subtle",
			detail:"は",
			studentId:"e1e249b0-2485-424d-8418-eaa9a222bcd2",
			teacherId:"a29711b6-aec1-4007-b695-e87fb973360a"},

		{attendanceId:"57a7557f-8555-4dbe-b920-807b11b73ac7",
			time:new Date(new Date("2008-08-03T05:04:23.154Z").toUTCString().replace(" GMT","") ),
			condition:"subtle",
			detail:"さ",
			studentId:"e7d3f661-661b-4e57-ad56-7d002e8be43f",
			teacherId:"a29711b6-aec1-4007-b695-e87fb973360a"},

		{attendanceId:"0a51b1ef-5939-4c3a-b04a-9ed999a205e7",
			time:new Date(new Date("2009-03-23T10:42:53.237Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"さ",
			studentId:"6446e971-715f-42eb-a8e2-879635c42ffe",
			teacherId:"a29711b6-aec1-4007-b695-e87fb973360a"},

		{attendanceId:"f80cae3c-b974-44b2-a4c2-7e6757baaade",
			time:new Date(new Date("2003-01-10T16:43:34.346Z").toUTCString().replace(" GMT","") ),
			condition:"good",
			detail:"か",
			studentId:"bc332213-fcea-4ae5-97fe-4bb4f911c1d0",
			teacherId:"3f0713de-8070-43b1-a4fa-aa6edd0bde6b"},

		{attendanceId:"2e6b5329-3454-4c60-bfde-eb8653cf2c2d",
			time:new Date(new Date("2007-10-17T22:46:01.108Z").toUTCString().replace(" GMT","") ),
			condition:"subtle",
			detail:"は",
			studentId:"bcbdc394-f8ab-42ab-b4b6-e88a9a369cd0",
			teacherId:"3f0713de-8070-43b1-a4fa-aa6edd0bde6b"},

		{attendanceId:"ea56ec12-caaf-409d-a0f4-0997e1c3e456",
			time:new Date(new Date("2004-05-01T11:02:00.367Z").toUTCString().replace(" GMT","") ),
			condition:"subtle",
			detail:"あ",
			studentId:"bc332213-fcea-4ae5-97fe-4bb4f911c1d0",
			teacherId:"3f0713de-8070-43b1-a4fa-aa6edd0bde6b"},

		{attendanceId:"9881b7b1-def0-402b-921c-d1dc163fed31",
			time:new Date(new Date("2007-10-17T22:46:01.108Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"あ",
			studentId:"d7086629-7c6a-4b97-9fe3-0a1aac51cd46",
			teacherId:"572291de-00b5-4455-ac48-82e218604017"},

		{attendanceId:"9a6cb914-9832-4e82-86d6-12f52f6682a4",
			time:new Date(new Date("2007-10-17T22:46:01.108Z").toUTCString().replace(" GMT","") ),
			condition:"good",
			detail:"な",
			studentId:"d7086629-7c6a-4b97-9fe3-0a1aac51cd46",
			teacherId:"3f0713de-8070-43b1-a4fa-aa6edd0bde6b"},

		{attendanceId:"ab5e181e-8b1d-47d3-a793-4ad298a20f4f",
			time:new Date(new Date("2010-06-19T14:23:18.863Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"あ",
			studentId:"bc332213-fcea-4ae5-97fe-4bb4f911c1d0",
			teacherId:"3f0713de-8070-43b1-a4fa-aa6edd0bde6b"},

		{attendanceId:"bdf022ae-3805-489f-bf30-289e192ed768",
			time:new Date(new Date("2005-01-19T19:53:40.919Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"た",
			studentId:"e2065376-f95a-4cb4-aa9f-793a8eb8f359",
			teacherId:"572291de-00b5-4455-ac48-82e218604017"},

		{attendanceId:"166a24d9-0bed-4584-8ece-0a60ea4b3a2f",
			time:new Date(new Date("2007-04-23T18:51:42.137Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"た",
			studentId:"bc332213-fcea-4ae5-97fe-4bb4f911c1d0",
			teacherId:"3f0713de-8070-43b1-a4fa-aa6edd0bde6b"},

		{attendanceId:"f3d0aaa5-dc86-423f-bf2c-439854e74f60",
			time:new Date(new Date("2005-01-19T19:53:40.919Z").toUTCString().replace(" GMT","") ),
			condition:"bad",
			detail:"あ",
			studentId:"bcbdc394-f8ab-42ab-b4b6-e88a9a369cd0",
			teacherId:"572291de-00b5-4455-ac48-82e218604017"},

		{attendanceId:"f8e25701-cdb4-44f9-8504-8eea13751bf8",
			time:new Date(new Date("2007-10-17T22:46:01.108Z").toUTCString().replace(" GMT","") ),
			condition:"good",
			detail:"あ",
			studentId:"bc332213-fcea-4ae5-97fe-4bb4f911c1d0",
			teacherId:"3f0713de-8070-43b1-a4fa-aa6edd0bde6b"},
	],{
		updateOnDuplicate:true
	});
};

const goHomeCreate = (model) => {
	model.bulkCreate([
		{
			goHomeId: "77df8a8a-eb07-4ef0-8c3e-2145a239e4df",
			time: new Date(new Date("2007-10-17T22:46:01.108Z").toUTCString().replace(" GMT","") ),
			studentId: "d5162515-7ed3-48d7-b4de-046f13552ce4",
			teacherId: "a29711b6-aec1-4007-b695-e87fb973360a"
		},
		{
			goHomeId: "88648086-e9f8-4495-ad4f-ddfbfdb756d3",
			time: new Date(new Date("2007-10-17T22:46:01.108Z").toUTCString().replace(" GMT","") ),
			studentId: "e7d3f661-661b-4e57-ad56-7d002e8be43f",
			teacherId: "a29711b6-aec1-4007-b695-e87fb973360a",
		},{
			goHomeId: "b19b9b61-091b-437d-99ab-2cd2990b8a44",
			time: new Date(new Date("2006-08-01T14:37:29.426Z").toUTCString().replace(" GMT","") ),
			studentId: "12d7589d-2a79-4899-974e-b7c725655bf5",
			teacherId: "7e0060bf-b2f0-4169-aa8d-36e071bdc224",
		},{
			goHomeId: "a90dc770-aac4-405d-a901-361e08057fac",
			time: new Date(new Date("2007-04-23T18:51:42.137Z").toUTCString().replace(" GMT","") ),
			studentId: "e1e249b0-2485-424d-8418-eaa9a222bcd2",
			teacherId: "7e0060bf-b2f0-4169-aa8d-36e071bdc224",
		},{
			goHomeId: "265b4bcb-597c-4596-ba30-99c8daba4093",
			time: new Date(new Date("2005-01-19T19:53:40.919Z").toUTCString().replace(" GMT","") ),
			studentId: "bcbdc394-f8ab-42ab-b4b6-e88a9a369cd0",
			teacherId: "572291de-00b5-4455-ac48-82e218604017",
		},{
			goHomeId: "30c48416-dffb-49a5-bb61-fd2e3ccf0535",
			time: new Date(new Date("2007-04-23T18:51:42.137Z").toUTCString().replace(" GMT","") ),
			studentId: "e2065376-f95a-4cb4-aa9f-793a8eb8f359",
			teacherId: "572291de-00b5-4455-ac48-82e218604017",
		}

	],{
		updateOnDuplicate:true
	});
};



module.exports = {
	schools:schoolCreate,
	teachers:teacherCreate,
	parties:partyCreate,
	students:studentCreate,
	attendances:attendanceCreate,
	goHomes:goHomeCreate
};
