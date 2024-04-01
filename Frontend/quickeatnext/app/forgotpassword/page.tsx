import { useRouter } from "next/router";

const ForgotPasswordPage = () => {
  const router = useRouter();
  console.log(router.query.slug);

  return (
    <>
      <div>bdbcdv</div>
    </>
  );
};

export default ForgotPasswordPage;
