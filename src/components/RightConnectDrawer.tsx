import {
	Avatar,
	Badge,
	BadgeProps,
	Box,
	Button,
	Drawer,
	IconButton,
	Skeleton,
	Slide,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import { FC, useContext, useMemo } from "react";
import { PageContext } from "../contexts/page";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@emotion/react";
import { tokens } from "../contexts/theme";
import React from "react";
import { isEmpty, toUpper } from "lodash";
import LogoutIcon from "@mui/icons-material/Logout";
import TextCopy from "./TextCopy";
import { toast } from "react-toastify";

const RightConnectDrawer = () => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const { connectDrawer, setConnectDrawer, screenSize } =
		useContext(PageContext);

	return screenSize === "sm" ? (
		<Drawer
			anchor={"bottom"}
			open={connectDrawer}
			onClose={() => setConnectDrawer(false)}
			sx={{ backgroundColor: "transparent" }}
		>
			<Box
				height={"90vh"}
				sx={{ backgroundColor: colors.primary[200] }}
				borderTop={1}
				borderRadius={2}
				borderColor={colors.primary[500]}
			>
				<DrawerContent />
			</Box>
		</Drawer>
	) : (
		<Slide in={connectDrawer} direction="left">
			<Box
				height="calc(100vh - 12px)"
				width={"25rem"}
				border={1}
				borderRadius={2}
				borderColor={colors.primary[500]}
				position={"absolute"}
				right={5}
				top={5}
				sx={{ backgroundColor: colors.primary[200] }}
			>
				<DrawerContent />
			</Box>
		</Slide>
	);
};

export default RightConnectDrawer;



const ConnectHeader: FC<{ title: string; closeButton?: boolean }> = ({
	title,
	closeButton,
}) => {
	const { setConnectDrawer, screenSize } = useContext(PageContext);
	return (
		<Stack direction={"row"} padding={1}>
			<Typography variant="h4" py={0.6} pl={1}>
				{title}
			</Typography>
			{closeButton && (
				<IconButton
					onClick={() => setConnectDrawer(false)}
					sx={{ marginLeft: "auto" }}
				>
					<CloseIcon />
				</IconButton>
			)}
		</Stack>
	);
};

const DrawerContent = () => {
	const { screenSize } = useContext(PageContext);
	return (
		<React.Fragment>
			<ConnectHeader
				title={"Connect a wallet"}
				closeButton={screenSize === "lg"}
			/>
			{(
				<Stack>
				</Stack>
			)}
		</React.Fragment>
	);
};

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
	"& .MuiBadge-badge": {
		right: "5px",
		top: "45px",
		border: `1px solid ${theme.palette.background.paper}`,
		padding: 0,
	},
}));

