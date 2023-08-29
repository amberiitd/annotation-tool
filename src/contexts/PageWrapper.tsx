import { useTheme } from "@emotion/react";
import { FC, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppNavBar from "../components/AppNavBar2";
import RightConnectDrawer from "../components/RightConnectDrawer";
import { PageContext } from "./page";
import { tokens } from "./theme";
import { Box } from "@mui/material";

const Main: FC<{ children: any }> = ({ children }) => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);
	const navigate = useNavigate();
	const { path1 } = useParams();
	const {} = useContext(PageContext);
	const notfound = useMemo(
		() => !["app", "generate", "share"].includes(path1 || ""),
		[path1]
	);

	return (
		<main
			className="app"
			style={{
				background: `linear-gradient(${colors.bg[100]}, ${colors.primary[100]})`,
				position: "relative",
        // overflow: 'hidden'
			}}
		>
			<AppNavBar />
			{/* <Box sx={{ overflow: "scroll", height: "calc(100% - 70px)", border: 1 }}>
				
			</Box> */}
      {children}
    
			{/* <RightConnectDrawer /> */}
		</main>
	);
};

export default Main;
