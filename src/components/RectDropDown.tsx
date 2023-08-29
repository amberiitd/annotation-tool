import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FC, useMemo, useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RectDropdown: FC<{
	id: number;
	onDelete: () => void;
	rect: any;
	canvas: any;
	image: any;
}> = ({ id, onDelete, rect, canvas, image }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const ratio = useMemo(() => {
		var ratio_w = canvas.width / image.naturalWidth;
		var ratio_h = canvas.height / image.naturalHeight;

		return { ratio_w, ratio_h };
	}, [canvas, image]);

	return (
		<Box
			position={"absolute"}
			left={image.offsetLeft+ rect.x1 * ratio.ratio_w}
			top={image.offsetTop + rect.y1 * ratio.ratio_h}
		>
			<Button
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
        size="small"
        variant="contained"
        sx={{padding: 0, minWidth: 10}}
			>
				<ArrowDropDownIcon />
			</Button>
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				<MenuItem
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
						handleClose();
					}}
				>
					Delete
				</MenuItem>
			</Menu>
		</Box>
	);
};

export default RectDropdown;
