import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  Target,
  Zap,
  Brain,
  Mic,
  MicOff,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import layout from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PromptCategory } from '@/types/prompt';

interface AIAssistantProps {
  onPromptSuggestion?: (prompt: string) => void;
  category?: PromptCategory;
  testID?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  suggestions?: string[];
  rating?: 'positive' | 'negative' | null;
}

interface AssistantPersonality {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  systemPrompt: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  onPromptSuggestion,
  category = 'writing',
  testID
}) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPersonality, setSelectedPersonality] = useState<string>('creative');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [conversationMode, setConversationMode] = useState<'chat' | 'prompt-builder' | 'optimizer'>('chat');
  
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

  const personalities: AssistantPersonality[] = [
    {
      id: 'creative',
      name: 'Creative Muse',
      description: 'Inspiring and imaginative, perfect for creative prompts',
      icon: Sparkles,
      color: theme.accent1,
      systemPrompt: 'You are a creative AI assistant focused on inspiring and imaginative prompt creation.'
    },
    {
      id: 'analytical',
      name: 'Logic Master',
      description: 'Precise and analytical, great for technical prompts',
      icon: Brain,
      color: theme.accent2,
      systemPrompt: 'You are an analytical AI assistant focused on logical and precise prompt optimization.'
    },
    {
      id: 'mentor',
      name: 'Wise Mentor',
      description: 'Supportive and educational, helps you learn',
      icon: Lightbulb,
      color: theme.accent3,
      systemPrompt: 'You are a wise mentor AI assistant focused on educational and supportive guidance.'
    },
    {
      id: 'optimizer',
      name: 'Performance Pro',
      description: 'Results-focused, optimizes for maximum effectiveness',
      icon: Target,
      color: theme.accent4,
      systemPrompt: 'You are a performance-focused AI assistant specialized in optimizing prompts for maximum effectiveness.'
    }
  ];

  const quickActions = [
    { id: 'improve', label: 'Improve this prompt', icon: Zap },
    { id: 'explain', label: 'Explain this concept', icon: Lightbulb },
    { id: 'examples', label: 'Give me examples', icon: Target },
    { id: 'alternatives', label: 'Show alternatives', icon: RotateCcw },
  ];

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: `Hello! I'm your AI assistant. I'm here to help you create, improve, and optimize your prompts. What would you like to work on today?`,
      timestamp: new Date(),
      suggestions: [
        'Help me create a marketing prompt',
        'Optimize my existing prompt',
        'Explain prompt engineering basics',
        'Generate creative writing ideas'
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Animate typing indicator
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(typingAnimation, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingAnimation.stopAnimation();
    }
  }, [isLoading, typingAnimation]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate AI response - in real app, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 1500));

      const responses = {
        'improve': `Here's an improved version of your prompt:\n\n**Enhanced Prompt:**\n"${text}"\n\n**Improvements made:**\n• Added specific context\n• Clarified desired output format\n• Included relevant constraints\n• Enhanced clarity and precision`,
        'explain': `Let me explain this concept:\n\n**Key Points:**\n• This relates to ${category} prompts\n• The main principle is clarity and specificity\n• Best practices include providing context and examples\n• Consider your target audience and desired outcome`,
        'examples': `Here are some examples for your ${category} prompt:\n\n**Example 1:** [Specific example]\n**Example 2:** [Another example]\n**Example 3:** [Third example]\n\nThese examples show different approaches you can take.`,
        'alternatives': `Here are alternative approaches:\n\n**Option A:** Focus on emotional appeal\n**Option B:** Emphasize logical structure\n**Option C:** Use storytelling elements\n**Option D:** Apply data-driven approach\n\nEach has different strengths depending on your goal.`
      };

      const responseContent = responses[text.toLowerCase() as keyof typeof responses] || 
        `I understand you want help with: "${text}"\n\nBased on your ${category} category, I recommend:\n\n• Be specific about your desired outcome\n• Provide relevant context and constraints\n• Use clear, actionable language\n• Consider your target audience\n\nWould you like me to help you refine this further?`;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        suggestions: [
          'Make it more specific',
          'Add examples',
          'Optimize for clarity',
          'Generate variations'
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, category]);

  const handleQuickAction = useCallback((actionId: string) => {
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    if (lastUserMessage) {
      sendMessage(`${actionId}: ${lastUserMessage.content}`);
    } else {
      sendMessage(actionId);
    }
  }, [messages, sendMessage]);

  const handleSuggestionPress = useCallback((suggestion: string) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  const handleRateMessage = useCallback((messageId: string, rating: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
    
    // In real app, send feedback to improve AI
    console.log(`Message ${messageId} rated as ${rating}`);
  }, []);

  const handleCopyMessage = useCallback(async (content: string) => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(content);
      } else {
        // For mobile, you'd use @react-native-clipboard/clipboard
        console.log('Copied to clipboard:', content);
      }
      Alert.alert('Copied!', 'Message copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy message');
    }
  }, []);

  const handleUseAsPrompt = useCallback((content: string) => {
    onPromptSuggestion?.(content);
    Alert.alert('Applied!', 'Content has been applied to your prompt editor');
  }, [onPromptSuggestion]);

  const startVoiceRecording = useCallback(() => {
    setIsRecording(true);
    // In real app, start voice recording
    console.log('Started voice recording');
    
    // Simulate recording for demo
    setTimeout(() => {
      setIsRecording(false);
      sendMessage('This is a voice message converted to text');
    }, 3000);
  }, [sendMessage]);

  const toggleSpeech = useCallback(() => {
    setIsSpeaking(!isSpeaking);
    // In real app, toggle text-to-speech
    console.log('Toggle speech:', !isSpeaking);
  }, [isSpeaking]);

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    const personality = personalities.find(p => p.id === selectedPersonality);
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        <View style={[
          styles.messageAvatar,
          { backgroundColor: isUser ? theme.primary : personality?.color || theme.accent1 }
        ]}>
          {isUser ? (
            <User size={16} color={theme.card} />
          ) : (
            <Bot size={16} color={theme.card} />
          )}
        </View>
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.assistantMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText
          ]}>
            {message.content}
          </Text>
          
          <Text style={styles.messageTime}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          
          {!isUser && (
            <View style={styles.messageActions}>
              <TouchableOpacity
                style={styles.messageActionButton}
                onPress={() => handleCopyMessage(message.content)}
              >
                <Copy size={14} color={theme.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.messageActionButton}
                onPress={() => handleUseAsPrompt(message.content)}
              >
                <Zap size={14} color={theme.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.messageActionButton,
                  message.rating === 'positive' && styles.messageActionButtonActive
                ]}
                onPress={() => handleRateMessage(message.id, 'positive')}
              >
                <ThumbsUp size={14} color={
                  message.rating === 'positive' ? theme.success : theme.textSecondary
                } />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.messageActionButton,
                  message.rating === 'negative' && styles.messageActionButtonActive
                ]}
                onPress={() => handleRateMessage(message.id, 'negative')}
              >
                <ThumbsDown size={14} color={
                  message.rating === 'negative' ? theme.error : theme.textSecondary
                } />
              </TouchableOpacity>
            </View>
          )}
          
          {message.suggestions && message.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {message.suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
      <View style={[styles.messageAvatar, { backgroundColor: theme.accent1 }]}>
        <Bot size={16} color={theme.card} />
      </View>
      <View style={[styles.messageBubble, styles.assistantMessageBubble]}>
        <View style={styles.typingIndicator}>
          <Animated.View style={[
            styles.typingDot,
            { opacity: typingAnimation }
          ]} />
          <Animated.View style={[
            styles.typingDot,
            { opacity: typingAnimation, marginLeft: 4 }
          ]} />
          <Animated.View style={[
            styles.typingDot,
            { opacity: typingAnimation, marginLeft: 4 }
          ]} />
        </View>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: layout.spacing.md,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: theme.text,
      marginLeft: layout.spacing.sm,
    },
    headerSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.sm,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: layout.spacing.sm,
    },
    headerButton: {
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.backgroundLight,
    },
    personalitySelector: {
      flexDirection: 'row',
      padding: layout.spacing.sm,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    personalityChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.borderRadius.round,
      backgroundColor: theme.backgroundLight,
      marginRight: layout.spacing.sm,
    },
    personalityChipActive: {
      backgroundColor: theme.primary,
    },
    personalityText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    personalityTextActive: {
      color: theme.card,
    },
    messagesContainer: {
      flex: 1,
      padding: layout.spacing.md,
    },
    messageContainer: {
      flexDirection: 'row',
      marginBottom: layout.spacing.md,
      alignItems: 'flex-start',
    },
    userMessageContainer: {
      justifyContent: 'flex-end',
    },
    assistantMessageContainer: {
      justifyContent: 'flex-start',
    },
    messageAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: layout.spacing.sm,
    },
    messageBubble: {
      maxWidth: '75%',
      borderRadius: layout.borderRadius.lg,
      padding: layout.spacing.md,
    },
    userMessageBubble: {
      backgroundColor: theme.primary,
      borderBottomRightRadius: layout.borderRadius.sm,
    },
    assistantMessageBubble: {
      backgroundColor: theme.card,
      borderBottomLeftRadius: layout.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    userMessageText: {
      color: theme.card,
    },
    assistantMessageText: {
      color: theme.text,
    },
    messageTime: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: layout.spacing.xs,
      opacity: 0.7,
    },
    messageActions: {
      flexDirection: 'row',
      marginTop: layout.spacing.sm,
      gap: layout.spacing.xs,
    },
    messageActionButton: {
      padding: layout.spacing.xs,
      borderRadius: layout.borderRadius.sm,
      backgroundColor: theme.backgroundLight,
    },
    messageActionButtonActive: {
      backgroundColor: theme.primary + '20',
    },
    suggestionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: layout.spacing.sm,
      gap: layout.spacing.xs,
    },
    suggestionChip: {
      paddingHorizontal: layout.spacing.sm,
      paddingVertical: layout.spacing.xs,
      borderRadius: layout.borderRadius.round,
      backgroundColor: theme.primary + '20',
      borderWidth: 1,
      borderColor: theme.primary + '30',
    },
    suggestionText: {
      fontSize: 12,
      color: theme.primary,
    },
    quickActionsContainer: {
      flexDirection: 'row',
      padding: layout.spacing.sm,
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: layout.spacing.xs,
    },
    quickActionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: layout.spacing.sm,
      borderRadius: layout.borderRadius.md,
      backgroundColor: theme.backgroundLight,
    },
    quickActionText: {
      fontSize: 11,
      color: theme.textSecondary,
      marginLeft: layout.spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: layout.spacing.md,
      backgroundColor: theme.card,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: layout.spacing.sm,
    },
    textInput: {
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: layout.borderRadius.lg,
      paddingHorizontal: layout.spacing.md,
      paddingVertical: layout.spacing.sm,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      maxHeight: 100,
    },
    inputButton: {
      padding: layout.spacing.sm,
      borderRadius: layout.borderRadius.round,
      backgroundColor: theme.primary,
    },
    inputButtonDisabled: {
      backgroundColor: theme.textSecondary,
    },
    recordingButton: {
      backgroundColor: theme.error,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: layout.spacing.sm,
    },
    typingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.textSecondary,
    },
  });

  const currentPersonality = personalities.find(p => p.id === selectedPersonality);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      testID={testID}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MessageCircle size={24} color={theme.primary} />
          <View>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Text style={styles.headerSubtitle}>{currentPersonality?.name}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleSpeech}
          >
            {isSpeaking ? (
              <Volume2 size={18} color={theme.textSecondary} />
            ) : (
              <VolumeX size={18} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Settings size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.personalitySelector} horizontal showsHorizontalScrollIndicator={false}>
        {personalities.map((personality) => {
          const IconComponent = personality.icon;
          return (
            <TouchableOpacity
              key={personality.id}
              style={[
                styles.personalityChip,
                selectedPersonality === personality.id && styles.personalityChipActive
              ]}
              onPress={() => setSelectedPersonality(personality.id)}
            >
              <IconComponent 
                size={14} 
                color={selectedPersonality === personality.id ? theme.card : theme.textSecondary} 
              />
              <Text style={[
                styles.personalityText,
                selectedPersonality === personality.id && styles.personalityTextActive
              ]}>
                {personality.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}
        {isLoading && renderTypingIndicator()}
      </ScrollView>

      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action.id)}
            >
              <IconComponent size={14} color={theme.textSecondary} />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[
            styles.inputButton,
            isRecording && styles.recordingButton
          ]}
          onPress={startVoiceRecording}
          disabled={isLoading}
        >
          {isRecording ? (
            <MicOff size={18} color={theme.card} />
          ) : (
            <Mic size={18} color={theme.card} />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={`Ask ${currentPersonality?.name} anything...`}
          placeholderTextColor={theme.textSecondary}
          multiline
          maxLength={1000}
          editable={!isLoading}
          onSubmitEditing={() => sendMessage(inputText)}
        />

        <TouchableOpacity
          style={[
            styles.inputButton,
            (!inputText.trim() || isLoading) && styles.inputButtonDisabled
          ]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.card} />
          ) : (
            <Send size={18} color={theme.card} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AIAssistant;