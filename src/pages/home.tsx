import { useTheme } from "@emotion/react";
import { Box, Button, IconButton, Menu, Stack } from "@mui/material";
import {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { tokens } from "../contexts/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import GradientText from "../components/GradientText";
import PageWrapper from "../contexts/PageWrapper";
import { PageContext } from "../contexts/page";
import { imageList } from "../constants/general";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-toastify";
import { isEmpty } from "lodash";
import RectDropdown from "../components/RectDropDown";

const vertexRadius = 5;
const lineWidth = 3;

const Home = () => {
	const theme: any = useTheme();
	const colors2 = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { drawId } = useParams();
	const navigate = useNavigate();
	const { annotedData, setAnnotedData } = useContext(PageContext);
	const selectedAnnotation = useMemo(() => {
		const onEdit = Object.entries(annotedData).find(
			(ann) => ann[0] == (drawId || "0")
		);
		return onEdit
			? {
					image: imageList[parseInt(onEdit[0])],
					rects: onEdit[1] as any[],
			  }
			: { image: "", rects: [] };
	}, [drawId, annotedData]);
	const [rectsOnEdit, setRectsOnEdit] = useState(
		selectedAnnotation?.rects || []
	);

	const [renderedImage, setRenderedImage] = useState<any>();
	const imageRef = useRef<any>();
	const canvasRef = useRef<any>();
	const [mouse, setMouse] = useState({ x: 0, y: 0 });
	const [rectActionPayload, setRectActionPayload] = useState<any>({});
	const [actionRect, setActionRect] = useState<any>();
	const [renderRatio, setRenderRatio] = useState({ ratio_h: 1, ratio_w: 1 });

	const intializeCanvas = useCallback(() => {
		const canvas: any = canvasRef.current; //document.getElementById("canvas");

		if (!canvas || !renderedImage) return;
		canvas.height = renderedImage.height;
		canvas.width = renderedImage.width;
		canvas.style.top = renderedImage.offsetTop + "px";
		canvas.style.left = renderedImage.offsetLeft + "px";
	}, [renderedImage]);

	const adjustRects = useCallback(() => {
		const canvas: any = canvasRef.current;
		if (!canvas || !renderedImage) return [];

		var ratio_w = canvas.width / renderedImage.naturalWidth;
		var ratio_h = canvas.height / renderedImage.naturalHeight;

		//BORDER OF SIZE lineWidth!
		const newRender = rectsOnEdit.map((rect: any) => ({
			width: (rect.x2 - rect.x1) * ratio_h - lineWidth,
			height: (rect.y2 - rect.y1) * ratio_w - lineWidth,
			top: rect.y1 * ratio_h + lineWidth / 2,
			left: rect.x1 * ratio_w + lineWidth / 2,
		}));

		return newRender;
	}, [renderedImage, rectsOnEdit]);

	const reverseRects = useCallback(
		(rects: any[]) => {
			const canvas: any = canvasRef.current;
			if (!canvas || !renderedImage) return [];

			var ratio_w = canvas.width / renderedImage.naturalWidth;
			var ratio_h = canvas.height / renderedImage.naturalHeight;

			//BORDER OF SIZE lineWidth!

			const newonEdit = rects.map((rect: any) => {
				let y1 = (rect.top - lineWidth / 2) / ratio_h;
				let x1 = (rect.left - lineWidth / 2) / ratio_w;
				let x2 = (rect.width + lineWidth) / ratio_h + x1;
				let y2 = (rect.height + lineWidth) / ratio_w + y1;
				return {
					x1,
					y1,
					x2,
					y2,
				};
			});

			return newonEdit;
		},
		[renderedImage, rectsOnEdit]
	);

	const [renderedRects, setRenderedRects] = useState<any[]>([]);

	const reRenderRects = () => {
		const canvas: any = canvasRef.current;
		if (!canvas || !renderedImage) return;

		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		adjustRects().forEach((rect: any) => {
			drawRectInCanvas(rect, ctx);
		});
	};

	const onImageLoad = useCallback(() => {
		const image: any = imageRef.current;
		setRenderedImage({
			height: image.height,
			width: image.width,
			offsetTop: image.offsetTop,
			offsetLeft: image.offsetLeft,
			naturalWidth: image.naturalWidth,
			naturalHeight: image.naturalHeight,
		});
		// console.log(image.naturalWidth, image.naturalHeight);
	}, [intializeCanvas]);

	const mouseDown = useCallback(
		(e: any) => {
			var pos = getMousePos(canvasRef.current, e);
			setMouse({ ...pos });
			const rects = adjustRects();
			let payload = null;

			for (let i = 0; i < rects.length; i++) {
				payload = getRectActionPayload(rects[i], pos);
				if (payload.action) {
					setRectActionPayload({ ...payload, index: i });
					setActionRect({ ...rects[i] });
					return;
				}
			}
			setRectActionPayload({
				action: true,
				drawNew: true,
				x: pos.x,
				y: pos.y,
			});
			setActionRect({ top: pos.x, left: pos.y, height: 0, width: 0 });
		},
		[adjustRects]
	);

	const mouseMove = useCallback(
		(e: any) => {
			const canvas: any = canvasRef.current;
			var ctx = canvas.getContext("2d");
			if (!canvas || !renderedImage || !rectActionPayload?.action) return;

			let rect = { ...actionRect };
			let { x: mouseX, y: mouseY } = getMousePos(canvas, e);

			if (rectActionPayload.dragWholeRect) {
				e.preventDefault();
				e.stopPropagation();

				let dx = mouseX - rectActionPayload.x;
				let dy = mouseY - rectActionPayload.y;
				if (
					rect.left + dx > 0 &&
					rect.left + dx + rect.width < canvas.width
				) {
					rect.left += dx;
				}
				if (
					rect.top + dy > 0 &&
					rect.top + dy + rect.height < canvas.height
				) {
					rect.top += dy;
				}

				setRectActionPayload((payload: any) => ({
					...payload,
					x: mouseX,
					y: mouseY,
				}));
			} else if (rectActionPayload.dragTL) {
				e.preventDefault();
				e.stopPropagation();
				var newSide =
					(Math.abs(rect.left + rect.width - mouseX) +
						Math.abs(rect.height + rect.top - mouseY)) /
					2;
				rect.width += rect.left - mouseX;
				rect.height += rect.top - mouseY;
				rect.left = mouseX;
				rect.top = mouseY;
			} else if (rectActionPayload.dragTR) {
				e.preventDefault();
				e.stopPropagation();
				var newSide =
					(Math.abs(mouseX - rect.left) +
						Math.abs(rect.height + rect.top - mouseY)) /
					2;
				rect.width = mouseX - rect.left;
				rect.height += rect.top - mouseY;
				rect.top = mouseY;
			} else if (rectActionPayload.dragBL) {
				e.preventDefault();
				e.stopPropagation();
				rect.width += rect.left - mouseX;
				rect.height = mouseY - rect.top;
				rect.left = mouseX;
			} else if (rectActionPayload.dragBR) {
				e.preventDefault();
				e.stopPropagation();
				rect.width = mouseX - rect.left;
				rect.height = mouseY - rect.top;
			} else if (rectActionPayload.drawNew) {
				e.preventDefault();
				e.stopPropagation();
				if (
					rectActionPayload.x < mouseX &&
					rectActionPayload.y < mouseY
				) {
					rect.top = rectActionPayload.y;
					rect.left = rectActionPayload.x;
					rect.height = mouseY - rectActionPayload.y;
					rect.width = mouseX - rectActionPayload.x;
				} else if (
					rectActionPayload.x > mouseX &&
					rectActionPayload.y > mouseY
				) {
					rect.top = mouseY;
					rect.left = mouseX;
					rect.height = rectActionPayload.y - mouseY;
					rect.width = rectActionPayload.x - mouseX;
				} else if (
					rectActionPayload.x < mouseX &&
					rectActionPayload.y > mouseY
				) {
					rect.top = mouseY;
					rect.left = rectActionPayload.x;
					rect.height = rectActionPayload.y - mouseY;
					rect.width = mouseX - rectActionPayload.x;
				} else {
					rect.top = rectActionPayload.y;
					rect.left = mouseX;
					rect.height = mouseY - rectActionPayload.y;
					rect.width = rectActionPayload.x - mouseX;
				}
			}
			setActionRect(rect);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const rects = adjustRects();
			if (rectActionPayload?.index >= 0)
				rects.splice(rectActionPayload.index, 1);
			rects.forEach((r: any) => {
				drawRectInCanvas(r, ctx);
			});
			drawRectInCanvas(rect, ctx);
		},
		[actionRect, rectActionPayload, adjustRects]
	);

	const mouseUp = useCallback(
		(e: any) => {
			if (rectActionPayload?.action) {
				const rects = adjustRects();
				if (rectActionPayload?.index >= 0) {
					rects.splice(rectActionPayload.index, 1, actionRect);
				} else {
					rects.push(actionRect);
				}
				setRectsOnEdit(reverseRects(rects));
			}
			setRectActionPayload(undefined);
		},
		[rectActionPayload, actionRect, adjustRects]
	);

	const onSave = useCallback(() => {
		setAnnotedData((data: any) => ({
			...data,
			[drawId || "0"]: [...rectsOnEdit],
		}));
		toast.success("Annotation saved :)");
	}, [rectsOnEdit, drawId]);

	const onDownload = useCallback(() => {
		// create file in browser
		if (isEmpty(annotedData)) {
			toast.warn("No annotations saved!");
			return;
		}
		const fileName = "annotation";
		const json = JSON.stringify(annotedData, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const href = URL.createObjectURL(blob);

		// create "a" HTLM element with href to file
		const link = document.createElement("a");
		link.href = href;
		link.download = fileName + ".json";
		document.body.appendChild(link);
		link.click();

		// clean up "a" element & remove ObjectURL
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
    window.open(href);

		toast.success("Download successful");
	}, [annotedData]);
	// effects
	useEffect(() => {
		setRectsOnEdit(selectedAnnotation?.rects || []);
	}, [selectedAnnotation]);

	useEffect(() => {
		intializeCanvas();
		reRenderRects();
	}, [renderedImage, rectsOnEdit]);

	useLayoutEffect(() => {
		window.addEventListener("resize", onImageLoad);
		return () => window.removeEventListener("resize", onImageLoad);
	}, [renderedImage]);

	return (
		<PageWrapper>
			<Box
				display={"flex"}
				justifyContent={"center"}
				paddingTop={5}
				paddingBottom={5}
				paddingLeft={2}
				paddingRight={2}
				maxHeight={700}
				overflow={"auto"}
			>
				<Box
					padding={1}
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"center"}
				>
					<IconButton
						onClick={() =>
							navigate(
								`/draw/${Math.max(
									0,
									parseInt(drawId || "0") - 1
								)}`
							)
						}
					>
						<ChevronLeftIcon />
					</IconButton>
				</Box>
				<Box
					width={"calc(100% - 100px)"}
					display={"flex"}
					justifyContent={"center"}
				>
					<img
						ref={imageRef}
						id="full-image"
						src={imageList[parseInt(drawId || "0")]}
						style={{
							position: "relative",
							borderWidth: 2,
							borderStyle: "solid",
							borderColor: colors2.green[100],
							borderRadius: 4,
							maxHeight: "100%",
							maxWidth: "100%",
						}}
						onLoad={onImageLoad}
					/>
				</Box>
				<canvas
					ref={canvasRef}
					id="canvas"
					style={{ position: "absolute", left: 0, top: 200 }}
					onMouseDown={mouseDown}
					onMouseUp={mouseUp}
					onMouseMove={mouseMove}
					onTouchStart={mouseDown}
					onTouchMove={mouseMove}
					onTouchEnd={mouseUp}
				></canvas>
				{rectsOnEdit.filter((rect, index) => index !== rectActionPayload?.index).map((rect, index) => (
					<RectDropdown
						id={index}
						onDelete={() => {
							const newRect = [...rectsOnEdit];
							newRect.splice(index, 1);
							setRectsOnEdit(newRect);
						}}
						canvas={canvasRef.current}
						image={renderedImage}
						rect={rect}
						key={`menu=${index}`}
					/>
				))}
				<Box
					padding={1}
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"center"}
				>
					<IconButton
						onClick={() =>
							navigate(
								`/draw/${Math.min(
									imageList.length - 1,
									parseInt(drawId || "0") + 1
								)}`
							)
						}
					>
						<ChevronRightIcon />
					</IconButton>
				</Box>
			</Box>
			<Stack
				mt={5}
				spacing={2}
				direction={"row"}
				justifyContent={"center"}
			>
				<Button
					variant="contained"
					sx={{ minWidth: "7rem" }}
					onClick={onSave}
				>
					Save
				</Button>
				<Button
					variant="outlined"
					sx={{ minWidth: "7rem" }}
					onClick={onDownload}
				>
					Download
				</Button>
			</Stack>
		</PageWrapper>
	);
};

export default Home;

const drawVertex = (x: number, y: number, ctx: any) => {
	ctx.fillStyle = "#c757e7";
	ctx.beginPath();
	ctx.arc(x, y, vertexRadius, 0, 2 * Math.PI);
	ctx.fill();
};

const markVertices = (rect: any, ctx: any) => {
	drawVertex(rect.left, rect.top, ctx);
	drawVertex(rect.left + rect.width, rect.top, ctx);
	drawVertex(rect.left + rect.width, rect.top + rect.height, ctx);
	drawVertex(rect.left, rect.top + rect.height, ctx);
};

const drawRectInCanvas = (rect: any, ctx: any) => {
	// var ctx = canvas.getContext("2d");
	// ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.lineWidth = `${lineWidth}`;
	ctx.fillStyle = "rgba(199, 87, 231, 0.2)";
	ctx.strokeStyle = "#c757e7";
	ctx.rect(rect.left, rect.top, rect.width, rect.height);
	ctx.fill();
	ctx.stroke();
	markVertices(rect, ctx);
};

const getMousePos = (canvas: any, e: any) => {
	let x, y;
	if (e.type == "touchstart" || e.type == "touchmove") {
		x = e.touches[0].clientX;
		y = e.touches[0].clientY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}
	var boundingRect = canvas.getBoundingClientRect();
	return {
		x: x - boundingRect.left,
		y: y - boundingRect.top,
	};
};

const checkInRect = (x: number, y: number, r: any) => {
	return (
		x > r.left && x < r.width + r.left && y > r.top && y < r.top + r.height
	);
};

const checkCloseEnough = (p1: number, p2: number) => {
	return Math.abs(p1 - p2) < vertexRadius;
};

const getRectActionPayload = (rect: any, { x, y }: any) => {
	let payload: any = { action: false };
	if (checkInRect(x, y, rect)) {
		payload.action = true;
		payload.dragWholeRect = true;
		payload.x = x;
		payload.y = y;
	}
	// 1. top left
	else if (checkCloseEnough(x, rect.left) && checkCloseEnough(y, rect.top)) {
		payload.action = true;
		payload.dragTL = true;
	}
	// 2. top right
	else if (
		checkCloseEnough(x, rect.left + rect.width) &&
		checkCloseEnough(y, rect.top)
	) {
		payload.action = true;
		payload.dragTR = true;
	}
	// 3. bottom left
	else if (
		checkCloseEnough(x, rect.left) &&
		checkCloseEnough(y, rect.top + rect.height)
	) {
		payload.action = true;
		payload.dragBL = true;
	}
	// 4. bottom right
	else if (
		checkCloseEnough(x, rect.left + rect.width) &&
		checkCloseEnough(y, rect.top + rect.height)
	) {
		payload.action = true;
		payload.dragBR = true;
	}
	return payload;
};
