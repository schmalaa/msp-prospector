import { createTheme, rem, colorsTuple } from '@mantine/core';

// TargetZero Cyber-Executive Yellow
const targetYellow = colorsTuple('#EAB308');

export const theme = createTheme({
  primaryColor: 'targetYellow',
  primaryShade: 5,
  colors: {
    targetYellow,
  },
  defaultGradient: { from: '#EAB308', to: '#FACC15', deg: 135 },
  fontFamily: 'var(--font-geist-sans), sans-serif',
  headings: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
    sizes: {
      h1: { fontSize: rem(48), lineHeight: '1.2', fontWeight: '800' },
      h2: { fontSize: rem(36), lineHeight: '1.3', fontWeight: '700' },
      h3: { fontSize: rem(28), lineHeight: '1.4', fontWeight: '700' },
    },
  },
  components: {
    Card: {
      defaultProps: {
        shadow: 'none',
        withBorder: true,
        radius: 'sm',
      },
      styles: {
        root: {
          backgroundColor: '#1E1F22',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'border-color 0.2s ease',
          '&:hover': {
             borderColor: 'rgba(234, 179, 8, 0.3)', // Subtle yellow glow on hover instead of shadow
          },
        },
      },
    },
    Button: {
      defaultProps: {
        radius: 'sm',
        size: 'md',
        color: 'targetYellow'
      },
      styles: {
        root: {
          fontWeight: 700,
          letterSpacing: '0.5px'
        }
      }
    },
    Badge: {
       defaultProps: {
         radius: 'xs',
         color: 'targetYellow'
       }
    },
    TextInput: {
      defaultProps: {
        radius: 'sm',
      },
      styles: {
        input: {
          backgroundColor: '#141517', // Extremely dark for inputs
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          '&:focus': {
            borderColor: '#EAB308', // Electric yellow focus state
          },
        },
      },
    },
  },
});
