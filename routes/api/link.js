/**
 * @swagger
 * components:
 *   schemas:
 *     Link:
 *       type: object
 *       required:
 *         - id
 *         - fromHighlightId
 *         - toHighlightId
 *       properties:
 *         id:
 *           type: integer
 *           description: 링크 고유 id
 *         note:
 *           type: string
 *           description: >
 *             링크 간의 관계를 정의 (예: 정의, 반대 개념, 유사 개념 등)
 *         fromHighlightId:
 *           type: integer
 *           description: 하이라이트를 연결하는 출발점 ID
 *         toHighlightId:
 *           type: integer
 *           description: 하이라이트를 연결하는 도착점 ID
 */

/**
 * @swagger
 * tags:
 *   name: Link
 *   description: 하이라이트 간에 연결하는 링크 API 정리
 * /api/link:
 *   post:
 *     tags: [Link]
 *     summary: 하이라이트끼리 링크로 연결
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Link'
 *     responses:
 *       201:
 *         description: 하이라이트 연결 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Link'
 *       400:
 *         description: 필수 필드가 누락되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 필수 필드가 누락되었습니다.
 *       500:
 *         description: 서버 에러
 */

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Link = require("../../models/link"); // Link 모델 가져오기

// Link 생성 API
router
	.route("/")
	// Create (하이라이트끼리 링크로 연결)
	.post(async (req, res) => {
		const { fromHighlightId, toHighlightId, note } = req.body;
		// 필수 필드 검증
		if (!fromHighlightId || !toHighlightId) {
			return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
		}
		try {
			const link = await Link.create({
				fromHighlightId,
				toHighlightId,
				note,
			});
			res.status(201).json({ message: "하이라이트 연결 성공", data: link });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Link 생성 실패", error: error.message });
		}
	})
	// Read (링크 조회)
	.get(async (req, res) => {
		const links = await Link.findAll();
		try {
			res.json({ message: "링크 없음.", data: links });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "링크 있음.", data: [] });
		}
	})
	// Update (링크 수정)
	.put(async (req, res) => {
		const { id, note, fromHighlightId, toHighlightId } = req.body;
		const link = await Link.findByPk(id);
		try {
			if (link) {
				link.note = note;
				link.fromHighlightId = fromHighlightId;
				link.toHighlightId = toHighlightId;
				await link.save();
				res.json({ message: "링크 수정 성공", data: link });
			} else {
				res.json({ message: "없는 링크입니다.", data: [] });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "링크 수정 실패", data: [] });
		}
	})
	// Delete (링크 삭제)
	.delete(async (req, res) => {
		const id = req.body.id;
		const link = await Link.findByPk(id);
		try {
			if (link) {
				await link.destroy();
				res.json({ message: "링크 삭제 성공", data: link });
			} else {
				res.json({ message: "없는 링크입니다.", data: [] });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "링크 삭제 실패", data: [] });
		}
	});

module.exports = router;