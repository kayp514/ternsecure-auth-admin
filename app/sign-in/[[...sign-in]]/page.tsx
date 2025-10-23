

import { SignInFormField } from "@/components/signin-form-field";

import { SignInProvider} from '@tern-secure/nextjs';

export default function Page() {
  return (
    <SignInProvider>
      <SignInFormField />
    </SignInProvider>
  );
}
