//========//
// SPRITE //
//========//
const makeSprite = (name, {scale = 1.0} = {}) => {
	const image = new Image()
	image.src = `images/${name}.png`
	const sprite = {image}
	image.onload = () => {
		sprite.width = image.width * scale
		sprite.height = image.height * scale
	}
	return sprite
}

const tode = makeSprite("tode", {scale: 0.15})
const berd = makeSprite("berd", {scale: 0.15})
const bot = makeSprite("bot", {scale: 0.15})

//======//
// PART //
//======//
const MAX_TIME = 2*Math.PI
const makePart = ({sprite, placer, particleCount = 20} = {}) => {
	const particleOffset = MAX_TIME / particleCount
	const part = {sprite, placer, time: 0, particleCount, particleOffset}
	return part
}

const io = makePart({
	sprite: berd,
	particleCount: 30,
	placer: ({context, time, ratio}) => {
		const {canvas} = context
		const {width, height} = canvas
		return {
			x: context.canvas.width - (ratio * (width+berd.width)),
			y: height/2 + Math.cos(0.5)*100 + Math.cos(time)*100,
			rotation: -ratio*2 + Math.PI/4,
		}
	}
})

const sequence = makePart({
	sprite: tode,
	placer: ({context, time, ratio}) => {
		const {canvas} = context
		const {width, height} = canvas
		const speed = 1
		const size = 200
		const rotation = time*speed
		const centerX = width/2 - tode.width/2
		const centerY = height/4
		return {
			x: centerX - Math.sin(-rotation) * size,
			y: centerY - Math.cos(-rotation) * size,
			rotation: rotation + Math.PI,
			scale: [1, 1],
		}
	}
})

const judge = makePart({
	sprite: bot,
	placer: ({context, time, ratio, sprite}) => {
		const {canvas} = context
		const {width, height} = canvas
		const centerX = width/2 - sprite.width/2
		const centerY = 3*height/4 - sprite.height/3
		return {
			x: centerX + Math.cos(time)*150,
			y: centerY + Math.sin(time*2)*175,
			rotation: 0,
		}
	}
})

const parts = [
	sequence,
	io,
	judge,
]

//========//
// UPDATE //
//========//
const TIME_GROWTH = 0.01
const updatePart = (context, part) => {
	const {particleCount, particleOffset} = part
	for (let i = 0; i < particleCount; i++) {
		const time = Math.wrap(i*particleOffset + part.time, 0.0, MAX_TIME)
		const ratio = time/MAX_TIME
		const position = part.placer({context, time, ratio, sprite: part.sprite})

		const {
			x = 0,
			y = 0,
			rotation = 0,
			scale = [1, 1],
			width = part.sprite.width,
			height = part.sprite.height,
		 } = position

		context.translate(x + width/2, y + height/2)
		context.rotate(rotation)
		context.scale(...scale)
		context.drawImage(part.sprite.image, -width/2, -height/2, width, height)
		context.resetTransform()
	}

	part.time = Math.wrap(part.time + TIME_GROWTH, 0.0, MAX_TIME)
}

//=======//
// STAGE //
//=======//
const stage = Stage.start()
stage.update = (context) => {
	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)
	for (const part of parts) {
		updatePart(context, part)
	}
}