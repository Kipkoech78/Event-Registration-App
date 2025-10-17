import CommonForm from "@/components/common/form";
import { PageSkeleton } from "@/components/common/Skeleton";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  function onSubmit(e) {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message);
      }
      console.log(data);
    });
    console.log(formData);
  }
  function isFormValid() {
    const { userName, email, password, confirmPassword } = formData;
    if (!userName.trim()) return false;
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    if (password.length < 6) return false;
    if (password !== confirmPassword) return false;
    return true;
  }
  
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
      </div>
      {
        isLoading ? <Commet color="#0d0f0d" size="medium" text="" textColor="" />:
        <CommonForm
        formcontrols={registerFormControls}
        buttonText={"Create Account"}
        onSubmit={onSubmit}
        isBtnDisabled={!isFormValid()}
        formData={formData}
        setFormData={setFormData}
      />
      }
     
      <p className="mt-2">
        {" "}
        Already have an account
        <Link
          to="/auth/login"
          className="ml-2 text-primary font-medium hover: underline"
        >
          {" "}
          Login
        </Link>
      </p>
    </div>
  );
}
export default AuthRegister;
