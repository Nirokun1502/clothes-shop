import routesConfig from "../config";

//Layouts
// import { HeaderOnly } from "../layouts";

import Home from "../pages/Home";
import Account from "../pages/Account";
import Role from "../pages/Role";
import Permission from "../pages/Permission";
import About from "../pages/About";
import Profile from "../pages/Profile";
import Unauthorized from "../pages/Unauthorized";
import ChildrenOnlyLayout from "../layouts/ChildrenOnlyLayout";
import Product from "../pages/Product";
import DefaultUserLayout from "../layouts/DefaultUserLayout";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import CheckOut from "../pages/CheckOut";
import Order from "../pages/Order";
import UserProfile from "../pages/UserProfile";
import Statistic from "../pages/Statistic";
import Category from "../pages/Category";
import ProductTable from "../pages/ProductTable";
import OrderTable from "../pages/OrderTable";
import ChangePassword from "../pages/ChangePassword";
import CreateOrder from "../pages/CreateOrder";

//Admin Routes
const adminRoutes = [
  { path: routesConfig.routes.adminhome, component: Home },
  { path: routesConfig.routes.account, component: Account },
  { path: routesConfig.routes.role, component: Role },
  { path: routesConfig.routes.permission, component: Permission },
  { path: routesConfig.routes.about, component: About },
  { path: routesConfig.routes.profile, component: Profile },
  { path: routesConfig.routes.category, component: Category },
  { path: routesConfig.routes.producttable, component: ProductTable },
  { path: routesConfig.routes.statistic, component: Statistic },
  { path: routesConfig.routes.ordertable, component: OrderTable },

  // { path: routesConfig.routes.about, component: About, layout: HeaderOnly },
];

//Public Routes
const publicRoutes = [
  {
    path: routesConfig.routes.unauthorized,
    component: Unauthorized,
    layout: ChildrenOnlyLayout,
  },
  {
    path: routesConfig.routes.product,
    component: Product,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.productDetail,
    component: ProductDetail,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.cart,
    component: Cart,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.checkout,
    component: CheckOut,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.order,
    component: Order,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.userprofile,
    component: UserProfile,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.home,
    component: Product,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.default,
    component: Product,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.changepassword,
    component: ChangePassword,
    layout: DefaultUserLayout,
  },
  {
    path: routesConfig.routes.createorder,
    component: CreateOrder,
    layout: DefaultUserLayout,
  },
];

export { publicRoutes, adminRoutes };
