import { Button, IconButton, Stack, Typography, colors } from "@mui/material";
import Box from "@mui/material/Box";
import { FC, useContext, useMemo } from "react";
import { ColorModeContext, tokens } from "../contexts/theme";
import { useTheme } from "@emotion/react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { PageContext } from "../contexts/page";
import { Link, useLocation, useParams } from "react-router-dom";

const AppNavBar = () => {
	return (
		<Box display={"flex"} p={2} alignItems={"center"}>
			<AppIcon />
			<NavLinks />
			<Stack marginLeft={"auto"} spacing={2} direction={"row"}>
				<ThemeToggler />
			</Stack>
		</Box>
	);
};

export default AppNavBar;

const NavLinks = () => {
	const theme: any = useTheme();
	const { path1 } = useParams();
  const location = useLocation();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);

	const style = {
		textDecoration: "none",
		fontWeight: 600,
		color: theme.palette.primary.main,
	};
	return (
		<Stack direction={"row"} spacing={2} marginLeft={3}>
			<Link
				to="/draw"
				style={{
					...style,
					color: location.pathname.startsWith('/draw') ? colors.green[100] : "unset",
				}}
			>
				Draw
			</Link>
			<Link
				to="/annotations"
				style={{
					...style,
					color: location.pathname.startsWith('/annotations') ? colors.green[100] : "unset",
				}}
			>
				Saved
			</Link>
		</Stack>
	);
};

const AppIcon = () => {
	return (
		<Link to="/draw">
			<img
				src={`${process.env.PUBLIC_URL}/assets/logo2.png`}
				height="30px"
				width="30px"
			/>
		</Link>
	);
};

const ThemeToggler = () => {
	const colorMode = useContext(ColorModeContext);
	const theme: any = useTheme();
	return (
		<IconButton onClick={colorMode.toggleColorMode} size="small">
			{theme.palette.mode === "dark" ? (
				<DarkModeOutlinedIcon />
			) : (
				<LightModeOutlinedIcon />
			)}
		</IconButton>
	);
};


