type IconProps = React.HTMLAttributes<SVGElement>;
export const Icons = {
  google: (props: IconProps) => (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 48 48'
      width='48px'
      height='48px'
    >
      <path
        fill='#fbc02d'
        d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
      />
      <path
        fill='#e53935'
        d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
      />
      <path
        fill='#4caf50'
        d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
      />
      <path
        fill='#1565c0'
        d='M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
      />
    </svg>
  ),
  loading: () => {
    return (
      <svg
        version='1.1'
        viewBox='0 0 24 24'
        fill='none'
        stroke='#187afd'
        strokeWidth='1'
      >
        <path opacity='0.3'>
          <animate
            attributeName='d'
            dur='1s'
            repeatCount='indefinite'
            values='M12 2 Q9 2.2 7.3 7 Q6.5 9.5 6.5 12 Q6.5 15 7.3 17 Q9 22 12 22;M12 2 Q6.5 2.2 3.3 7 Q2 9.5 2 12 Q2 15 3.4 17 Q6.5 22 12 22;'
          />
        </path>
        <path opacity='0.3'>
          <animate
            attributeName='d'
            dur='1s'
            repeatCount='indefinite'
            values='M12 2 Q12 2.2 12 7 Q12 9.5 12 12 Q12 15 12 17 Q12 22 12 22;M12 2 Q9 2.2 7.3 7 Q6.5 9.5 6.5 12 Q6.5 15 7.3 17 Q9 22 12 22;'
          />
        </path>
        <path opacity='0.3'>
          <animate
            attributeName='d'
            dur='1s'
            repeatCount='indefinite'
            values='M12 2 Q15 2.2 16.6 7 Q17.5 9.5 17.5 12 Q17.5 15 16.7 17 Q15 22 12 22;M12 2 Q12 2.2 12 7 Q12 9.5 12 12 Q12 15 12 17 Q12 22 12 22;'
          />
        </path>
        <path opacity='0.3'>
          <animate
            attributeName='d'
            dur='1s'
            repeatCount='indefinite'
            values='M12 2 Q17.5 2.2 20.7 7 Q22 9.5 22 12 Q22 15 20.6 17 Q17.5 22 12 22;M12 2 Q15 2.2 16.6 7 Q17.5 9.5 17.5 12 Q17.5 15 16.7 17 Q15 22 12 22;'
          />
        </path>

        <circle cx='12' cy='12' r='10' />
        <path d='M2.4 8.6 Q6 7.1 12 7 Q18 7.1 21.6 8.6' />
        <path d='M2.4 15.2 Q6 17.1 12 17.2 Q17 17.1 21.6 15.2' />

        <path>
          <animate
            attributeName='d'
            dur='1s'
            repeatCount='indefinite'
            values='M12 2 Q6.5 2.2 3.3 7 Q2 9.5 2 12 Q2 15 3.4 17 Q6.5 22 12 22;M12 2 Q9 2.2 7.3 7 Q6.5 9.5 6.5 12 Q6.5 15 7.3 17 Q9 22 12 22;'
          />
        </path>
        <path>
          <animate
            attributeName='d'
            dur='1s'
            repeatCount='indefinite'
            values='M12 2 Q9 2.2 7.3 7 Q6.5 9.5 6.5 12 Q6.5 15 7.3 17 Q9 22 12 22;M12 2 Q12 2.2 12 7 Q12 9.5 12 12 Q12 15 12 17 Q12 22 12 22;'
          />
        </path>
        <path>
          <animate
            attributeName='d'
            dur='1s'
            repeatCount='indefinite'
            values='M12 2 Q12 2.2 12 7 Q12 9.5 12 12 Q12 15 12 17 Q12 22 12 22;M12 2 Q15 2.2 16.6 7 Q17.5 9.5 17.5 12 Q17.5 15 16.7 17 Q15 22 12 22;'
          />
        </path>
        <path>
          <animate
            attributeName='d'
            dur='1s'
            repeatCount='indefinite'
            values='M12 2 Q15 2.2 16.6 7 Q17.5 9.5 17.5 12 Q17.5 15 16.7 17 Q15 22 12 22;M12 2 Q17.5 2.2 20.7 7 Q22 9.5 22 12 Q22 15 20.6 17 Q17.5 22 12 22;'
          />
        </path>
      </svg>
    );
  },
};
