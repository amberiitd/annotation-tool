import { useMediaQuery } from "@mui/material";
import { noop } from "lodash";
import { createContext, FC, useEffect, useMemo, useState } from "react";
import AppNavBar from "../components/AppNavBar2";

// {
//   label: 'Unnaned',
//   id: "1",
//   image: 'https://variance-fl-media.s3.eu-west-3.amazonaws.com/taupiboxed.jpg',
//   rects: [
//     {
//       "x1": 504, // left coordinate of the box
//       "y1": 600, // top coordinate of the box
//       "x2": 2500, // right coordinate of the box
//       "y2": 2000// bottom coordinate of the box
//     },
//     {
//       "x1": 300, // left coordinate of the box
//       "y1": 200, // top coordinate of the box
//       "x2": 1000, // right coordinate of the box
//       "y2": 1000// bottom coordinate of the box
//     }
//   ]
// }

export const PageContext = createContext<{
  annotedData: {[key: string]: any[]};
  setAnnotedData: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  connectDrawer: boolean;
  setConnectDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  screenSize: "sm" | "lg";
	navigationOff: boolean;
	setNavigationOff: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  annotedData: {},
  setAnnotedData: noop,
  loading: false,
  setLoading: noop,
  connectDrawer: false,
  setConnectDrawer: noop,
  screenSize: 'lg',
	navigationOff: false,
	setNavigationOff: noop,
});
const PageContextProvider: FC<{ children: any }> = ({ children }) => {
  const [openNetworkMenu, setOpenNetworkMenu] = useState(false);
  const largeScreen = useMediaQuery('(min-width: 600px)')
	const [navigationOff, setNavigationOff] = useState<boolean>(false);
  const screenSize = useMemo(() => largeScreen? 'lg': 'sm', [largeScreen])
  const [connectDrawer, setConnectDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [annotedData, setAnnotedData]= useState<any>({})

	return (
		<PageContext.Provider
			value={{
        annotedData,
        setAnnotedData,
        loading,
        setLoading,
        connectDrawer,
        setConnectDrawer,
        screenSize,
				navigationOff,
				setNavigationOff,
			}}
		>
			{children}
		</PageContext.Provider>
	);
};

export default PageContextProvider;
