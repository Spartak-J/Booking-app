Status: ACTIVE
Applies to: all new and modified screens

These rules apply to:
• all new screens
• any screen being modified beyond bugfixes

They do NOT require full refactor of legacy screens.

Purpose
This template defines the only allowed structure for new screens in the project.
All new screens MUST be created from this template.


1. Screen responsibilities

A screen is a composition + orchestration layer only.

It is responsible for:
•	composing feature components
•	wiring navigation
•	wiring data (queries, stores)
•	handling screen-level state (open/close, tabs, filters)

A screen is NOT responsible for:
•	visual design
•	typography
•	colors
•	interactions
•	animations


2. Allowed imports

// react
import React from 'react';

// navigation
import { useNavigation } from '@react-navigation/native';

// data
import { useQuery } from '@tanstack/react-query';

// i18n
import { useTranslation } from '@/i18n';

// ui
import { ScreenContainer } from '@/ui';

// feature components
import { SomeFeatureBlock } from '@/components/SomeFeatureBlock';



3. Forbidden imports (NEW CODE)

❌ Screens MUST NOT import:

import { Text } from 'react-native';
import { Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';
import { useTheme } from '@/theme';

❌ Screens MUST NOT define:
•	fontSize
•	fontFamily
•	lineHeight
•	colors
•	animations
•	gesture logic


4. Styling rules

Screens may define ONLY layout styles:

✅ Allowed:

const styles = StyleSheet.create({
container: {
flex: 1,
gap: spacing.lg,
},
});

❌ Forbidden:

fontSize: 16
color: '#000'
borderRadius: 12

Typography, colors, borders, interactions MUST live in ui/ or components/.


5. i18n rules
   •	All user-visible strings MUST use:

t('some.key')

	•	Hardcoded strings are allowed ONLY if:

// TODO: move to i18n



6. Navigation rules
   •	Screens may navigate only via route names defined in navigation layer.
   •	Route names MUST NOT be hardcoded in new code (use enum / typed navigation).
   Screens must not import navigation route strings directly.
   Use typed navigation or Routes enum.

7. Legacy handling

Existing screens may violate these rules.

They MUST be marked with:

// LEGACY SCREEN
// TODO: migrate to ui/components

Legacy code must not be extended with new violations.


8. Minimal Screen Template (copy-paste)

// Screen: ExampleScreen
// Used in: RootNavigator
// Status: NEW (must follow Screen rules)

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { ScreenContainer } from '@/ui';
import { spacing } from '@/theme';
import { ExampleBlock } from '@/components/ExampleBlock';

export const ExampleScreen = () => {
const { t } = useTranslation();

return (
<ScreenContainer edges={['top', 'left', 'right']}>
<View style={styles.container}>
<ExampleBlock title={t('example.title')} />
</View>
</ScreenContainer>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
gap: spacing.lg,
},
});

export default ExampleScreen;


9. Codex checklist (MANDATORY)

Before finishing any screen task, Codex MUST verify:
•	No Text, Pressable, TouchableOpacity, TextInput
•	No useTheme() in screen
•	No fontSize / color / radius defined
•	All strings via t()
•	Layout-only styles
•	Feature logic moved to components


10. Where to place this

Recommended location:

/docs/SCREEN_TEMPLATE.md

And reference it from:
•	ARCHITECTURE.md
•	README.md