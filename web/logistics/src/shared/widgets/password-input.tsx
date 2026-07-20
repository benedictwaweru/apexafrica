import { useId, useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface PasswordInputProps {
  value: string;
  handleChange: (value: string) => void;
  handleBlur: () => void;
  name: string;
  isInvalid: boolean;
}

const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!@#$%^&*()-_=+]/, text: 'At least 1 special character' },
];

const checkStrength = (password: string) => {
  return requirements.map((req) => ({
    met: req.regex.test(password),
    text: req.text,
  }));
};

export function PasswordInput({
  value,
  handleChange,
  handleBlur,
  name,
  isInvalid,
}: PasswordInputProps) {
  const id = useId();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const strength = checkStrength(value);

  const strengthScore = strength.filter((req) => req.met).length;

  const getStrengthInfo = (
    score: number,
  ): { color: string; text: string; width: string } => {
    if (score === 0) return { color: 'bg-border', text: '', width: 'w-0' };
    if (score <= 3)
      return { color: 'bg-destructive', text: 'Weak', width: 'w-1/5' };
    if (score === 4)
      return { color: 'bg-warning', text: 'Medium', width: 'w-3/5' };
    if (score === 5)
      return { color: 'bg-success', text: 'Strong', width: 'w-full' };

    return { color: 'bg-border', text: '', width: 'w-0' };
  };

  const { color, text, width } = getStrengthInfo(strengthScore);

  return (
    <>
      <div className="*:not-first:mt-2">
        <div className="relative">
          <Input
            id={id}
            name={name}
            className="pe-9"
            placeholder="Password"
            type={isVisible ? 'text' : 'password'}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            aria-describedby={`${name}-description`}
            required
            aria-invalid={isInvalid}
          />
          <Button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            type="button"
            aria-controls="password"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            variant="ghost"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeOff size={16} aria-hidden="true" />
            ) : (
              <Eye size={16} aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      <div
        className="bg-border h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuetext={text || 'Empty'}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${color} ${width} transition-all duration-500 ease-out`}
        />
      </div>

      {/* Password strength description */}
      <p
        id={`${id}-description`}
        className="text-foreground mb-2 text-xs font-medium"
      >
        {text}
      </p>
    </>
  );
}
